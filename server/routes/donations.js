import express from "express";
import Donation from "../models/Donation.js";
import upload from "../middleware/upload.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";
import { queueEmail } from "../utils/emailService.js";

const router = express.Router();

// GET /api/donations - Get all verified donors
router.get("/", async (req, res) => {
  try {
    const donors = await Donation.find({ status: "verified" })
      .select("name batch amount created_at")
      .sort({ created_at: -1 });

    res.json({ success: true, data: donors });
  } catch (error) {
    console.error("Error fetching donors:", error);
    res.status(500).json({ success: false, error: "Failed to fetch donors" });
  }
});

// POST /api/donations - Create a new donation
router.post("/", upload.single("payment_proof"), async (req, res) => {
  try {
    const {
      name,
      batch,
      email,
      phone,
      amount,
      donor_type,
      show_on_wall,
      testimonial,
    } = req.body;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "Payment proof is required" });
    }

    // Upload screenshot to Cloudinary
    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      "iedc/donations",
      req.file.originalname
    );

    const newDonation = new Donation({
      name,
      batch,
      email,
      phone,
      amount,
      donorType: donor_type,
      screenshot: uploadResult.url,
      showOnWall: show_on_wall === "true" || show_on_wall === true, // Handle string/boolean
      testimonial,
      status: "pending", // Default status
    });

    await newDonation.save();

    // Send confirmation email to the donor
    const mailOptions = {
      to: email,
      subject: "Thank you for your contribution to IEDC Summit 2025",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank you, ${name}!</h2>
          <p>We have received your donation details for the IEDC Summit 2025 Crowdfunding Campaign.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Donation Details:</h3>
            <p><strong>Amount:</strong> ₹${amount}</p>
            <p><strong>Batch:</strong> ${batch}</p>
            <p><strong>Transaction Reference:</strong> ${newDonation._id}</p>
            <p><strong>Status:</strong> Pending Verification</p>
          </div>

          <p>Our team will verify your payment proof shortly. Once verified, your name will appear on our donor wall (if you opted in).</p>
          
          <p>Your support means the world to us and helps us empower the next generation of innovators.</p>
          
          <p>Best regards,<br>IEDC LBSCEK Team</p>
        </div>
      `,
    };

    // Send emails (awaiting them to ensure they complete in serverless environment)
    const emailPromises = [];

    // 1. Email to Donor
    emailPromises.push(
      queueEmail(mailOptions).catch((err) =>
        console.error("Failed to send donation email to donor:", err)
      )
    );

    // Send notification email to Admin
    const adminEmail = process.env.EMAIL_USER; // Or process.env.ADMIN_EMAIL
    if (adminEmail) {
      const serverUrl = process.env.SERVER_URL || "http://localhost:5000"; // Fallback for dev
      // In production, ensure SERVER_URL is set to your backend URL (e.g., https://iedclbscekapi.onrender.com)
      // If SERVER_URL is not set, we try to construct it from the request if possible, but env var is safer.
      // For now, we'll use a relative path if the client is on the same domain, but email links need absolute URLs.
      // Let's assume the user will set SERVER_URL or we use the request host.
      const baseUrl =
        process.env.SERVER_URL || `${req.protocol}://${req.get("host")}`;

      const adminMailOptions = {
        to: adminEmail,
        subject: `New Donation: ₹${amount} from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">New Donation Received</h2>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Donor Details:</h3>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Batch:</strong> ${batch}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Amount:</strong> ₹${amount}</p>
              <p><strong>Type:</strong> ${donor_type}</p>
              <p><strong>Show on Wall:</strong> ${
                show_on_wall ? "Yes" : "No"
              }</p>
              <p><strong>Testimonial:</strong> ${testimonial || "None"}</p>
            </div>

            <h3>Payment Proof:</h3>
            <div style="margin: 20px 0; text-align: center;">
              <img src="${
                uploadResult.url
              }" alt="Payment Proof" style="max-width: 100%; border: 1px solid #ddd; border-radius: 5px;" />
              <p><a href="${
                uploadResult.url
              }" target="_blank">View Full Image</a></p>
            </div>

            <div style="margin-top: 30px; text-align: center;">
              <a href="${baseUrl}/api/donations/verify/${
          newDonation._id
        }" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-right: 10px; font-weight: bold;">Confirm Payment</a>
              <a href="${baseUrl}/api/donations/reject/${
          newDonation._id
        }" style="background-color: #f44336; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reject Payment</a>
            </div>
            
            <p style="margin-top: 30px; font-size: 12px; color: #666;">
              Clicking these buttons will directly update the status in the database.
            </p>
          </div>
        `,
      };

      emailPromises.push(
        queueEmail(adminMailOptions).catch((err) =>
          console.error("Failed to send admin notification:", err)
        )
      );
    }

    // Wait for all emails to be processed
    await Promise.all(emailPromises);

    res.status(201).json({
      success: true,
      message: "Donation submitted successfully",
      data: newDonation,
    });
  } catch (error) {
    console.error("Error creating donation:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to submit donation" });
  }
});

// GET /api/donations/verify/:id - Verify a donation
router.get("/verify/:id", async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status: "verified" },
      { new: true }
    );

    if (!donation) {
      return res.status(404).send("Donation not found");
    }

    // Send verification email to donor
    const mailOptions = {
      to: donation.email,
      subject: "Donation Verified - IEDC Summit 2025",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50;">Donation Verified!</h2>
          <p>Dear ${donation.name},</p>
          <p>We are happy to inform you that your donation of <strong>₹${
            donation.amount
          }</strong> has been successfully verified.</p>
          ${
            donation.show_on_wall
              ? "<p>Your name has been added to our Donor Wall.</p>"
              : ""
          }
          <p>Thank you once again for your generous support towards IEDC Summit 2025.</p>
          <p>Best regards,<br>IEDC LBSCEK Team</p>
        </div>
      `,
    };

    await queueEmail(mailOptions).catch((err) =>
      console.error("Failed to send verification email:", err)
    );

    res.send(`
      <html>
        <body style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h1 style="color: green;">Payment Verified!</h1>
          <p>The donation from <strong>${donation.name}</strong> has been marked as verified.</p>
          <p>It will now appear on the donor wall.</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Error verifying donation:", error);
    res.status(500).send("Internal Server Error");
  }
});

// GET /api/donations/reject/:id - Reject a donation
router.get("/reject/:id", async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    if (!donation) {
      return res.status(404).send("Donation not found");
    }

    res.send(`
      <html>
        <body style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h1 style="color: red;">Payment Rejected</h1>
          <p>The donation from <strong>${donation.name}</strong> has been marked as rejected.</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Error rejecting donation:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
