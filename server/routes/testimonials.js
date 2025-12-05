import express from "express";
import Donation from "../models/Donation.js";

const router = express.Router();

// GET /api/testimonials - Get verified testimonials
router.get("/", async (req, res) => {
  try {
    // const testimonials = await Donation.find({
    //   status: "verified",
    //   testimonial: { $exists: true, $ne: "" },
    // })
    //   .select("name batch testimonial created_at")
    //   .sort({ created_at: -1 })
    //   .limit(10); // Limit to 10 recent testimonials

    res.json({ success: true, data: [] });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch testimonials" });
  }
});

export default router;
