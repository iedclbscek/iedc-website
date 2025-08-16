import nodemailer from "nodemailer";
import crypto from "crypto";

// Create email transporter
const createTransporter = () => {
  // For development, you can use Gmail or a test service like Ethereal
  // For production, use a proper email service like SendGrid, AWS SES, etc.

  if (process.env.NODE_ENV === "development") {
    // Using Gmail for development (you'll need to enable app passwords)
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use app password, not regular password
      },
    });
  } else {
    // Production email service configuration
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
};

export const sendInvitationEmail = async (email, name, resetToken) => {
  try {
    const transporter = createTransporter();

    const resetUrl = `${process.env.CLIENT_URL}/set-password/${resetToken}`;

    const mailOptions = {
      from: `"IEDC LBSCEK" <${
        process.env.EMAIL_FROM || process.env.EMAIL_USER
      }>`,
      to: email,
      subject: "Welcome to IEDC Dashboard - Set Your Password",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to IEDC Dashboard</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
              margin-top: 20px;
            }
            .header {
              text-align: center;
              padding: 20px 0;
              border-bottom: 2px solid #e74c3c;
            }
            .logo {
              max-width: 150px;
              height: auto;
            }
            .content {
              padding: 30px 0;
            }
            .button {
              display: inline-block;
              background-color: #e74c3c;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
              font-weight: bold;
            }
            .button:hover {
              background-color: #c0392b;
            }
            .footer {
              text-align: center;
              padding: 20px 0;
              border-top: 1px solid #eee;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="color: #e74c3c; margin: 0;">IEDC LBSCEK</h1>
              <p style="margin: 5px 0 0 0; color: #666;">Innovation and Entrepreneurship Development Cell</p>
            </div>
            
            <div class="content">
              <h2>Welcome to the IEDC Dashboard, ${name}! 🎉</h2>
              
              <p>You have been invited to join the IEDC LBSCEK team dashboard. As a team member, you'll have access to exclusive features and tools to collaborate with your fellow innovators.</p>
              
              <p>To complete your registration and access your dashboard, please set up your password by clicking the button below:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Set My Password</a>
              </div>
              
              <p><strong>Important:</strong> This link will expire in 24 hours for security reasons.</p>
              
              <p>Once you've set your password, you'll be able to:</p>
              <ul>
                <li>Access your personalized dashboard</li>
                <li>Update your profile information</li>
                <li>Collaborate with team members</li>
                <li>Participate in IEDC activities</li>
              </ul>
              
              <p>If you have any questions or need assistance, feel free to reach out to the admin team.</p>
              
              <p>Welcome aboard! 🚀</p>
            </div>
            
            <div class="footer">
              <p>This email was sent by IEDC LBSCEK Dashboard System</p>
              <p>LBS College of Engineering, Kasaragod, Kerala</p>
              <p>If you didn't expect this email, please ignore it.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to IEDC Dashboard, ${name}!
        
        You have been invited to join the IEDC LBSCEK team dashboard.
        
        To complete your registration, please set up your password by visiting:
        ${resetUrl}
        
        This link will expire in 24 hours.
        
        Welcome aboard!
        
        IEDC LBSCEK Team
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("📧 Invitation email sent successfully:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("❌ Error sending invitation email:", error);
    return { success: false, error: error.message };
  }
};

export const sendPasswordResetEmail = async (email, name, resetToken) => {
  try {
    const transporter = createTransporter();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: `"IEDC LBSCEK" <${
        process.env.EMAIL_FROM || process.env.EMAIL_USER
      }>`,
      to: email,
      subject: "Reset Your IEDC Dashboard Password",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
              margin-top: 20px;
            }
            .header {
              text-align: center;
              padding: 20px 0;
              border-bottom: 2px solid #e74c3c;
            }
            .content {
              padding: 30px 0;
            }
            .button {
              display: inline-block;
              background-color: #e74c3c;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
              font-weight: bold;
            }
            .button:hover {
              background-color: #c0392b;
            }
            .footer {
              text-align: center;
              padding: 20px 0;
              border-top: 1px solid #eee;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="color: #e74c3c; margin: 0;">IEDC LBSCEK</h1>
              <p style="margin: 5px 0 0 0; color: #666;">Innovation and Entrepreneurship Development Centre</p>
            </div>
            
            <div class="content">
              <h2>Password Reset Request</h2>
              
              <p>Hello ${name},</p>
              
              <p>We received a request to reset your password for the IEDC Dashboard. If you made this request, please click the button below to reset your password:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset My Password</a>
              </div>
              
              <p><strong>Important:</strong> This link will expire in 1 hour for security reasons.</p>
              
              <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
            </div>
            
            <div class="footer">
              <p>This email was sent by IEDC LBSCEK Dashboard System</p>
              <p>LBS College of Engineering, Kasaragod, Kerala</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Password Reset Request
        
        Hello ${name},
        
        We received a request to reset your password for the IEDC Dashboard.
        
        To reset your password, please visit:
        ${resetUrl}
        
        This link will expire in 1 hour.
        
        If you didn't request this, please ignore this email.
        
        IEDC LBSCEK Team
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("📧 Password reset email sent successfully:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("❌ Error sending password reset email:", error);
    return { success: false, error: error.message };
  }
};

export const generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const hashResetToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const sendMembershipIdEmail = async (email, name, membershipId) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: `"IEDC LBSCEK" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your IEDC Membership ID",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your IEDC Membership ID</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); margin-top: 20px; }
            .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #e74c3c; }
            .footer { text-align: center; padding: 20px 0; border-top: 1px solid #eee; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="color: #e74c3c; margin: 0;">IEDC LBSCEK</h1>
              <p style="margin: 5px 0 0 0; color: #666;">Innovation and Entrepreneurship Development Cell</p>
            </div>
            <div class="content" style="padding: 30px 0;">
              <p>Dear ${name},</p>
              <p>We are happy to inform you that your IEDC Membership ID has been successfully generated.</p>
              <p style="font-size: 1.2em; font-weight: bold;">📌 Your Membership ID: <span style="color: #e74c3c;">${membershipId}</span></p>
              <p>Please keep this ID safe, as it will be required for all official IEDC-related communications, events, and activities.</p>
              <p>If you have any queries or notice any discrepancy, feel free to contact us.</p>
              <p>Thank you for being an active part of the Innovation and Entrepreneurship Development Cell. Together, let’s innovate, create, and inspire!</p>
              <p>Best regards,<br/>IEDC Team</p>
            </div>
            <div class="footer">
              <p>This email was sent by IEDC LBSCEK Dashboard System</p>
              <p>LBS College of Engineering, Kasaragod, Kerala</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Dear ${name},\n\nWe are happy to inform you that your IEDC Membership ID has been successfully generated.\n\nYour Membership ID: ${membershipId}\n\nPlease keep this ID safe, as it will be required for all official IEDC-related communications, events, and activities.\n\nIf you have any queries or notice any discrepancy, feel free to contact us.\n\nThank you for being an active part of the Innovation and Entrepreneurship Development Cell. Together, let’s innovate, create, and inspire!\n\nBest regards,\nIEDC Team`,
    };
    const result = await transporter.sendMail(mailOptions);
    console.log("📧 Membership ID email sent successfully:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("❌ Error sending membership ID email:", error);
    return { success: false, error: error.message };
  }
};
