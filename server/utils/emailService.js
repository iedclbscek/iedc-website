import nodemailer from "nodemailer";
import crypto from "crypto";

// Global transporter instance for connection pooling
let globalTransporter = null;

// Email sending queue for rate limiting
let emailQueue = [];
let isProcessingQueue = false;

// Create email transporter with pooling
const createTransporter = () => {
  if (globalTransporter) {
    return globalTransporter;
  }

  // Try SendGrid first if API key is available
  if (process.env.SENDGRID_API_KEY) {
    console.log("📧 Using SendGrid for email delivery");
    globalTransporter = nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      secure: false,
      auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY,
      },
      pool: true,
      maxConnections: 3,
      maxMessages: 50,
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000,
    });
  }
  // Fallback to Gmail/SMTP configuration
  else if (process.env.NODE_ENV === "development") {
    // Using Gmail for development (you'll need to enable app passwords)
    console.log("📧 Using Gmail for email delivery (development)");
    globalTransporter = nodemailer.createTransport({
      service: "gmail",
      pool: true, // Enable connection pooling
      maxConnections: parseInt(process.env.EMAIL_POOL_MAX_CONNECTIONS) || 5,
      maxMessages: parseInt(process.env.EMAIL_POOL_MAX_MESSAGES) || 100,
      rateDelta: parseInt(process.env.EMAIL_BULK_DELAY_MS) || 1000,
      rateLimit: parseInt(process.env.EMAIL_BULK_RATE_LIMIT) || 10,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use app password, not regular password
      },
      // Additional headers for better deliverability
      headers: {
        "List-Unsubscribe": `<${process.env.UNSUBSCRIBE_URL}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        "X-Mailer": "IEDC-LBSCEK-MailSystem",
        "Reply-To": process.env.EMAIL_USER,
      },
    });
  } else {
    // Production email service configuration with custom domain
    console.log("📧 Using SMTP/Gmail for email delivery (production)");
    globalTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: process.env.SMTP_PORT || 587,
      secure: false, // Use STARTTLS
      pool: true, // Enable connection pooling
      maxConnections: parseInt(process.env.EMAIL_POOL_MAX_CONNECTIONS) || 3,
      maxMessages: parseInt(process.env.EMAIL_POOL_MAX_MESSAGES) || 50,
      rateDelta: parseInt(process.env.EMAIL_BULK_DELAY_MS) || 2000,
      rateLimit: parseInt(process.env.EMAIL_BULK_RATE_LIMIT) || 5,
      // Connection timeout settings for production
      connectionTimeout: 60000, // 60 seconds
      greetingTimeout: 30000, // 30 seconds
      socketTimeout: 60000, // 60 seconds
      auth: {
        user: process.env.SMTP_USER || process.env.EMAIL_USER,
        pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
      },
      // Additional headers for better deliverability
      headers: {
        "List-Unsubscribe": `<${process.env.UNSUBSCRIBE_URL}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        "X-Mailer": "IEDC-LBSCEK-MailSystem",
        "Reply-To": process.env.EMAIL_USER,
      },
      // Better TLS configuration for production
      tls: {
        ciphers: "SSLv3",
        rejectUnauthorized: false,
      },
      // DKIM configuration (if available)
      dkim: process.env.DKIM_PRIVATE_KEY
        ? {
            domainName: process.env.DKIM_DOMAIN || "iedclbscek.com",
            keySelector: process.env.DKIM_SELECTOR || "default",
            privateKey: process.env.DKIM_PRIVATE_KEY,
          }
        : undefined,
    });
  }

  // Handle transporter errors
  globalTransporter.on("error", (error) => {
    console.error("❌ Transporter error:", error);
  });

  return globalTransporter;
};

// Rate-limited email sending function
const sendEmailWithRateLimit = async (mailOptions, retryCount = 0) => {
  const maxRetries = 3;
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  try {
    const transporter = createTransporter();
    const result = await transporter.sendMail(mailOptions);

    console.log(
      `📧 Email sent successfully to ${mailOptions.to}:`,
      result.messageId
    );
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error(
      `❌ Error sending email to ${mailOptions.to}:`,
      error.message
    );

    // Retry logic for temporary failures
    if (
      retryCount < maxRetries &&
      (error.code === "ETIMEDOUT" ||
        error.code === "ECONNRESET" ||
        error.code === "ECONNREFUSED" ||
        error.message.includes("Connection timeout") ||
        error.message.includes("timeout") ||
        error.responseCode >= 500)
    ) {
      console.log(
        `🔄 Retrying email to ${mailOptions.to} (attempt ${
          retryCount + 1
        }/${maxRetries})`
      );
      // Exponential backoff with jitter
      const baseDelay = 2000 * Math.pow(2, retryCount);
      const jitter = Math.random() * 1000;
      await delay(baseDelay + jitter);
      return sendEmailWithRateLimit(mailOptions, retryCount + 1);
    }

    return { success: false, error: error.message };
  }
};

// Process email queue with rate limiting
const processEmailQueue = async () => {
  if (isProcessingQueue || emailQueue.length === 0) {
    return;
  }

  isProcessingQueue = true;
  const delayMs = parseInt(process.env.EMAIL_BULK_DELAY_MS) || 1000;

  while (emailQueue.length > 0) {
    const { mailOptions, resolve } = emailQueue.shift();
    const result = await sendEmailWithRateLimit(mailOptions);
    resolve(result);

    // Rate limiting delay
    if (emailQueue.length > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  isProcessingQueue = false;
};

// Queue email for rate-limited sending
const queueEmail = (mailOptions) => {
  return new Promise((resolve) => {
    emailQueue.push({ mailOptions, resolve });
    processEmailQueue();
  });
};

export const sendInvitationEmail = async (email, name, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/set-password/${resetToken}`;

  const mailOptions = {
    from: `"IEDC LBSCEK" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: email,
    subject: "Welcome to IEDC - Complete Your Registration",
    headers: {
      "List-Unsubscribe": `<${process.env.UNSUBSCRIBE_URL}>`,
      "X-Priority": "3",
      "X-MSMail-Priority": "Normal",
    },
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
          .footer {
            text-align: center;
            padding: 20px 0;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
          }
          .unsubscribe {
            font-size: 12px;
            color: #999;
            margin-top: 10px;
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
            <h2>Welcome to IEDC, ${name}! 🎉</h2>
            
            <p>You have been invited to join the IEDC LBSCEK community. As a member, you'll have access to exclusive features and opportunities to collaborate with fellow innovators.</p>
            
            <p>To complete your registration and access your dashboard, please set up your password:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Complete Registration</a>
            </div>
            
            <p><strong>Important:</strong> This link will expire in 24 hours for security reasons.</p>
            
            <p>Once registered, you'll be able to:</p>
            <ul>
              <li>Access your personalized dashboard</li>
              <li>Update your profile information</li>
              <li>Participate in IEDC activities and events</li>
              <li>Connect with the innovation community</li>
            </ul>
            
            <p>If you have questions, please contact us at <a href="${
              process.env.CONTACT_URL || "mailto:" + process.env.EMAIL_USER
            }">our support team</a>.</p>
          </div>
          
          <div class="footer">
            <p>IEDC LBSCEK Dashboard System</p>
            <p>LBS College of Engineering, Kasaragod, Kerala</p>
            <div class="unsubscribe">
              <p>If you did not request this, please ignore this email.</p>
              <p><a href="${
                process.env.UNSUBSCRIBE_URL
              }">Unsubscribe</a> | <a href="${
      process.env.CONTACT_URL
    }">Contact Us</a></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Welcome to IEDC, ${name}!
      
      You have been invited to join the IEDC LBSCEK community.
      
      To complete your registration, please set up your password by visiting:
      ${resetUrl}
      
      This link will expire in 24 hours.
      
      If you have questions, please contact us.
      
      IEDC LBSCEK Team
      
      If you did not request this, please ignore this email.
      Unsubscribe: ${process.env.UNSUBSCRIBE_URL}
    `,
  };

  return await queueEmail(mailOptions);
};

export const sendPasswordResetEmail = async (
  email,
  name,
  resetToken,
  isNewUser = false
) => {
  const resetUrl = `${process.env.CLIENT_URL}/${
    isNewUser ? "set-password" : "reset-password"
  }?token=${resetToken}`;
  const subject = isNewUser
    ? "Welcome to IEDC - Set Your Password"
    : "Reset Your IEDC Dashboard Password";
  const heading = isNewUser ? "Welcome to IEDC!" : "Password Reset Request";
  const message = isNewUser
    ? "Congratulations! You have been approved as an Execom member. Please set your password using the button below:"
    : "We received a request to reset your password for the IEDC Dashboard. If you made this request, please click the button below to reset your password:";
  const buttonText = isNewUser ? "Set Your Password" : "Reset Password";

  const mailOptions = {
    from: `"IEDC LBSCEK" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    headers: {
      "List-Unsubscribe": `<${process.env.UNSUBSCRIBE_URL}>`,
      "X-Priority": "3",
      "X-MSMail-Priority": "Normal",
    },
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
              <h2>${heading}</h2>
              
              <p>Hello ${name},</p>
              
              <p>${message}</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">${buttonText}</a>
              </div>
              
              <p><strong>Important:</strong> This link will expire in 24 hours for security reasons.</p>
              
              ${
                isNewUser
                  ? "<p>As an Execom member, you will have access to special features and responsibilities within the IEDC Dashboard.</p>"
                  : "<p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>"
              }
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
        };

    const result = await transporter.sendMail(mailOptions);
    console.log("📧 Password reset email sent successfully:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("❌ Error sending password reset email:", error);
    return { success: false, error: error.message };
  }
};
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

  return await queueEmail(mailOptions);
};

export const generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const hashResetToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

// Send registration welcome email with membership ID and Google Groups link
export const sendRegistrationEmail = async (email, name, membershipId) => {
  const googleGroupsUrl = process.env.GOOGLE_GROUPS_JOIN_URL;

  const mailOptions = {
    from: `"IEDC LBSCEK" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: email,
    subject: "Registration Successful - Welcome to IEDC Community",
    headers: {
      "List-Unsubscribe": `<${process.env.UNSUBSCRIBE_URL}>`,
      "X-Priority": "3",
      "X-MSMail-Priority": "Normal",
    },
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to IEDC Community</title>
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
          .membership-card {
            background: linear-gradient(135deg, #e74c3c, #c0392b);
            color: white;
            border-radius: 12px;
            padding: 25px;
            text-align: center;
            margin: 25px 0;
            box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
          }
          .button {
            display: inline-block;
            background-color: #27ae60;
            color: white;
            padding: 15px 35px;
            text-decoration: none;
            border-radius: 8px;
            margin: 15px 10px;
            font-weight: bold;
            font-size: 16px;
          }
          .secondary-button {
            background-color: #3498db;
          }
          .footer { 
            text-align: center; 
            padding: 20px 0; 
            border-top: 1px solid #eee; 
            color: #666; 
            font-size: 14px; 
          }
          .unsubscribe {
            font-size: 12px;
            color: #999;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="color: #e74c3c; margin: 0;">🎉 Welcome to IEDC LBSCEK!</h1>
            <p style="margin: 5px 0 0 0; color: #666;">Innovation and Entrepreneurship Development Centre</p>
          </div>
          <div class="content">
            <h2>Registration Successful, ${name}! 🚀</h2>
            
            <p>Congratulations! You have successfully registered with the Innovation and Entrepreneurship Development Centre at LBS College of Engineering, Kasaragod.</p>
            
            <div class="membership-card">
              <h3 style="margin: 0 0 15px 0; font-size: 18px;">🆔 Your IEDC Membership</h3>
              <p style="font-size: 2em; font-weight: bold; margin: 10px 0; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">${membershipId}</p>
              <p style="margin: 15px 0 0 0; opacity: 0.9;">Keep this ID safe for all IEDC activities</p>
            </div>
            
            <h3>🌟 What's Next?</h3>
            <ol style="line-height: 1.8;">
              <li><strong>Join our community</strong> - Connect with fellow innovators and entrepreneurs</li>
              <li><strong>Stay updated</strong> - Get notifications about events, workshops, and opportunities</li>
              <li><strong>Participate actively</strong> - Engage in discussions and collaborative projects</li>
              <li><strong>Access resources</strong> - Utilize our platform for networking and learning</li>
            </ol>
            
            <div style="text-align: center; margin: 35px 0;">
              ${
                googleGroupsUrl
                  ? `<a href="${googleGroupsUrl}" class="button">🔗 Join Google Groups</a>`
                  : ""
              }
            </div>
            
            <div style="background: #f8f9fa; border-left: 4px solid #e74c3c; padding: 20px; margin: 25px 0;">
              <h4 style="color: #e74c3c; margin: 0 0 10px 0;">💡 Why Join Our Google Groups?</h4>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Receive instant notifications about events and deadlines</li>
                <li>Participate in community discussions and Q&A sessions</li>
                <li>Access exclusive resources and learning materials</li>
                <li>Network with industry professionals and mentors</li>
                <li>Collaborate on innovative projects and startups</li>
              </ul>
            </div>
            
            <p>We're excited to have you as part of our innovation ecosystem. Together, we'll work towards fostering entrepreneurship, creativity, and technological advancement.</p>
            
            <p>If you have any questions or need assistance, don't hesitate to reach out to our team.</p>
            
            <p style="color: #e74c3c; font-weight: 600;">Welcome aboard the innovation journey! 🎯</p>
            
            <p>Best regards,<br/>
            <strong>IEDC Team</strong><br/>
            LBS College of Engineering, Kasaragod</p>
          </div>
          <div class="footer">
            <p>📧 IEDC LBSCEK Dashboard System</p>
            <p>🏛️ LBS College of Engineering, Kasaragod, Kerala</p>
            <div class="unsubscribe">
              <p><a href="${
                process.env.UNSUBSCRIBE_URL
              }">Unsubscribe</a> | <a href="${
      process.env.CONTACT_URL
    }">Contact Us</a></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      🎉 Welcome to IEDC LBSCEK!
      
      Registration Successful, ${name}!
      
      Congratulations! You have successfully registered with the Innovation and Entrepreneurship Development Centre at LBS College of Engineering, Kasaragod.
      
      🆔 Your IEDC Membership ID: ${membershipId}
      Keep this ID safe for all IEDC activities.
      
      What's Next?
      1. Join our community - Connect with fellow innovators and entrepreneurs
      2. Stay updated - Get notifications about events, workshops, and opportunities  
      3. Participate actively - Engage in discussions and collaborative projects
      4. Access resources - Utilize our platform for networking and learning
      
      Join Google Groups: ${
        googleGroupsUrl || "Contact us for the community link"
      }
      
      Why Join Our Google Groups?
      - Receive instant notifications about events and deadlines
      - Participate in community discussions and Q&A sessions
      - Access exclusive resources and learning materials
      - Network with industry professionals and mentors
      - Collaborate on innovative projects and startups
      
      We're excited to have you as part of our innovation ecosystem. Together, we'll work towards fostering entrepreneurship, creativity, and technological advancement.
      
      If you have any questions or need assistance, don't hesitate to reach out to our team.
      
      Welcome aboard the innovation journey! 🎯
      
      Best regards,
      IEDC Team
      LBS College of Engineering, Kasaragod
      
      Unsubscribe: ${process.env.UNSUBSCRIBE_URL}
    `,
  };

  return await queueEmail(mailOptions);
};

// Test email function for spam testing (e.g., mail-tester.com)
export const sendTestEmail = async (testEmail = "test@mail-tester.com") => {
  const mailOptions = {
    from: `"IEDC LBSCEK" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: testEmail,
    subject: "IEDC Email Deliverability Test",
    headers: {
      "List-Unsubscribe": `<${process.env.UNSUBSCRIBE_URL}>`,
      "X-Priority": "3",
      "X-MSMail-Priority": "Normal",
      "X-Mailer": "IEDC-LBSCEK-MailSystem",
    },
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>IEDC Email Test</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px;">
          <h1 style="color: #e74c3c;">IEDC LBSCEK</h1>
          <p>Innovation and Entrepreneurship Development Centre</p>
        </div>
        
        <div style="padding: 30px 0;">
          <h2>Email Deliverability Test</h2>
          <p>This is a test email to check spam scoring and deliverability.</p>
          <p>Email configuration test for IEDC registration system.</p>
          <p>Date: ${new Date().toISOString()}</p>
        </div>
        
        <div style="text-align: center; padding: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
          <p>IEDC LBSCEK Dashboard System</p>
          <p>LBS College of Engineering, Kasaragod, Kerala</p>
          <p><a href="${process.env.UNSUBSCRIBE_URL}">Unsubscribe</a></p>
        </div>
      </body>
      </html>
    `,
    text: `
      IEDC LBSCEK
      Innovation and Entrepreneurship Development Centre
      
      Email Deliverability Test
      
      This is a test email to check spam scoring and deliverability.
      Email configuration test for IEDC registration system.
      Date: ${new Date().toISOString()}
      
      IEDC LBSCEK Dashboard System
      LBS College of Engineering, Kasaragod, Kerala
      
      Unsubscribe: ${process.env.UNSUBSCRIBE_URL}
    `,
  };

  console.log(`🧪 Sending test email to: ${testEmail}`);
  return await queueEmail(mailOptions);
};

// Bulk email function for existing members
export const sendBulkGoogleGroupsInvitation = async (members) => {
  const results = [];
  const googleGroupsUrl = process.env.GOOGLE_GROUPS_JOIN_URL;

  if (!googleGroupsUrl) {
    throw new Error(
      "Google Groups URL not configured in environment variables"
    );
  }

  console.log(`📧 Starting bulk email to ${members.length} members`);

  for (let i = 0; i < members.length; i++) {
    const member = members[i];

    try {
      const mailOptions = {
        from: `"IEDC LBSCEK" <${
          process.env.EMAIL_FROM || process.env.EMAIL_USER
        }>`,
        to: member.email,
        subject: "Join Our IEDC Google Groups Community",
        headers: {
          "List-Unsubscribe": `<${process.env.UNSUBSCRIBE_URL}>`,
          "X-Priority": "3",
          "X-MSMail-Priority": "Normal",
        },
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Join IEDC Google Groups</title>
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
                background-color: #27ae60;
                color: white;
                padding: 15px 35px;
                text-decoration: none;
                border-radius: 8px;
                margin: 20px 0;
                font-weight: bold;
                font-size: 16px;
              }
              .footer { 
                text-align: center; 
                padding: 20px 0; 
                border-top: 1px solid #eee; 
                color: #666; 
                font-size: 14px; 
              }
              .unsubscribe {
                font-size: 12px;
                color: #999;
                margin-top: 10px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="color: #e74c3c; margin: 0;">🌟 Join Our Community!</h1>
                <p style="margin: 5px 0 0 0; color: #666;">IEDC LBSCEK Google Groups</p>
              </div>
              <div class="content">
                <h2>Hello ${member.name || "IEDC Member"}! 👋</h2>
                
                <p>We're excited to invite you to join our official IEDC Google Groups community!</p>
                
                ${
                  member.membershipId
                    ? `<p><strong>Your Membership ID:</strong> ${member.membershipId}</p>`
                    : ""
                }
                
                <p>By joining our Google Groups, you'll get:</p>
                <ul>
                  <li>🔔 Instant notifications about events and workshops</li>
                  <li>💬 Direct communication with fellow entrepreneurs</li>
                  <li>📚 Access to exclusive resources and materials</li>
                  <li>🤝 Networking opportunities with industry mentors</li>
                  <li>🚀 Updates on startup competitions and funding opportunities</li>
                </ul>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${googleGroupsUrl}" class="button">🔗 Join Google Groups Now</a>
                </div>
                
                <p>Don't miss out on valuable discussions, announcements, and collaborative opportunities within our innovation ecosystem.</p>
                
                <p>Looking forward to seeing you in the community!</p>
                
                <p>Best regards,<br/>
                <strong>IEDC Team</strong><br/>
                LBS College of Engineering, Kasaragod</p>
              </div>
              <div class="footer">
                <p>📧 IEDC LBSCEK Dashboard System</p>
                <p>🏛️ LBS College of Engineering, Kasaragod, Kerala</p>
                <div class="unsubscribe">
                  <p><a href="${
                    process.env.UNSUBSCRIBE_URL
                  }">Unsubscribe</a> | <a href="${
          process.env.CONTACT_URL
        }">Contact Us</a></p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
          🌟 Join Our IEDC Google Groups Community!
          
          Hello ${member.name || "IEDC Member"}!
          
          We're excited to invite you to join our official IEDC Google Groups community!
          
          ${
            member.membershipId
              ? `Your Membership ID: ${member.membershipId}\n`
              : ""
          }
          
          By joining our Google Groups, you'll get:
          - Instant notifications about events and workshops
          - Direct communication with fellow entrepreneurs
          - Access to exclusive resources and materials
          - Networking opportunities with industry mentors
          - Updates on startup competitions and funding opportunities
          
          Join Google Groups: ${googleGroupsUrl}
          
          Don't miss out on valuable discussions, announcements, and collaborative opportunities within our innovation ecosystem.
          
          Looking forward to seeing you in the community!
          
          Best regards,
          IEDC Team
          LBS College of Engineering, Kasaragod
          
          Unsubscribe: ${process.env.UNSUBSCRIBE_URL}
        `,
      };

      const result = await queueEmail(mailOptions);
      results.push({
        email: member.email,
        name: member.name,
        success: result.success,
        messageId: result.messageId,
        error: result.error,
      });

      console.log(
        `📤 Email ${i + 1}/${members.length} processed for ${member.email}: ${
          result.success ? "SUCCESS" : "FAILED"
        }`
      );
    } catch (error) {
      console.error(`❌ Error processing email for ${member.email}:`, error);
      results.push({
        email: member.email,
        name: member.name,
        success: false,
        error: error.message,
      });
    }
  }

  console.log(
    `✅ Bulk email completed. ${results.filter((r) => r.success).length}/${
      results.length
    } emails sent successfully.`
  );
  return results;
};

export const sendMembershipIdEmail = async (email, name, membershipId) => {
  const googleGroupsUrl = process.env.GOOGLE_GROUPS_JOIN_URL;

  const mailOptions = {
    from: `"IEDC LBSCEK" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your IEDC Membership Details - Join Our Community",
    headers: {
      "List-Unsubscribe": `<${process.env.UNSUBSCRIBE_URL}>`,
      "X-Priority": "3",
      "X-MSMail-Priority": "Normal",
    },
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your IEDC Membership Details</title>
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
          .membership-id {
            background: #f8f9fa;
            border: 2px solid #e74c3c;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 20px 0;
          }
          .button {
            display: inline-block;
            background-color: #e74c3c;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px 5px;
            font-weight: bold;
          }
          .footer { 
            text-align: center; 
            padding: 20px 0; 
            border-top: 1px solid #eee; 
            color: #666; 
            font-size: 14px; 
          }
          .unsubscribe {
            font-size: 12px;
            color: #999;
            margin-top: 10px;
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
            <h2>Welcome to IEDC Community, ${name}! 🎉</h2>
            
            <p>Congratulations! Your IEDC membership has been successfully processed.</p>
            
            <div class="membership-id">
              <h3 style="color: #e74c3c; margin: 0 0 10px 0;">📌 Your Membership ID</h3>
              <p style="font-size: 1.5em; font-weight: bold; color: #e74c3c; margin: 0;">${membershipId}</p>
            </div>
            
            <p>Please keep this ID safe, as it will be required for all official IEDC communications, events, and activities.</p>
            
            <h3>🌟 Next Steps:</h3>
            <ol>
              <li><strong>Save your Membership ID</strong> for future reference</li>
              <li><strong>Join our Google Groups community</strong> to stay updated with announcements and discussions</li>
              <li><strong>Participate in upcoming events</strong> and networking opportunities</li>
            </ol>
            
            <div style="text-align: center; margin: 30px 0;">
              ${
                googleGroupsUrl
                  ? `<a href="${googleGroupsUrl}" class="button">Join Google Groups Community</a>`
                  : ""
              }
              <a href="${
                process.env.CLIENT_URL || "https://www.iedclbscek.in"
              }" class="button">Visit Dashboard</a>
            </div>
            
            <p><strong>Benefits of joining our Google Groups:</strong></p>
            <ul>
              <li>Get instant updates about events and opportunities</li>
              <li>Connect and network with fellow entrepreneurs</li>
              <li>Participate in community discussions and knowledge sharing</li>
              <li>Access to exclusive resources and announcements</li>
            </ul>
            
            <p>If you have any questions or notice any discrepancy, feel free to contact us.</p>
            
            <p>Thank you for being an active part of the Innovation and Entrepreneurship Development Centre. Together, let's innovate, create, and inspire!</p>
            
            <p>Best regards,<br/>IEDC Team</p>
          </div>
          <div class="footer">
            <p>IEDC LBSCEK Dashboard System</p>
            <p>LBS College of Engineering, Kasaragod, Kerala</p>
            <div class="unsubscribe">
              <p><a href="${
                process.env.UNSUBSCRIBE_URL
              }">Unsubscribe</a> | <a href="${
      process.env.CONTACT_URL
    }">Contact Us</a></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Welcome to IEDC Community, ${name}!
      
      Congratulations! Your IEDC membership has been successfully processed.
      
      Your Membership ID: ${membershipId}
      
      Please keep this ID safe, as it will be required for all official IEDC communications, events, and activities.
      
      Next Steps:
      1. Save your Membership ID for future reference
      2. Join our Google Groups community: ${
        googleGroupsUrl || "Contact us for the community link"
      }
      3. Participate in upcoming events and networking opportunities
      
      Benefits of joining our Google Groups:
      - Get instant updates about events and opportunities
      - Connect and network with fellow entrepreneurs
      - Participate in community discussions and knowledge sharing
      - Access to exclusive resources and announcements
      
      If you have any questions or notice any discrepancy, feel free to contact us.
      
      Thank you for being an active part of the Innovation and Entrepreneurship Development Centre. Together, let's innovate, create, and inspire!
      
      Best regards,
      IEDC Team
      
      Unsubscribe: ${process.env.UNSUBSCRIBE_URL}
    `,
  };

  return await queueEmail(mailOptions);
};

// Generic email sending function for verification codes and other purposes
export const sendEmail = async ({ to, subject, html, text }) => {
  const mailOptions = {
    from: `"IEDC LBSCEK" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ""), // Strip HTML tags for text version if not provided
  };

  return await queueEmail(mailOptions);
};

// Send notification email for membership ID updates
export const sendMembershipIdUpdateEmail = async (
  email,
  name,
  newMembershipId,
  oldMembershipId
) => {
  const googleGroupsUrl = process.env.GOOGLE_GROUPS_JOIN_URL;

  const mailOptions = {
    from: `"IEDC LBSCEK" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: email,
    subject: "Important: Your IEDC Membership ID Has Been Updated",
    headers: {
      "List-Unsubscribe": `<${process.env.UNSUBSCRIBE_URL}>`,
      "X-Priority": "3",
      "X-MSMail-Priority": "Normal",
    },
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your IEDC Membership ID Has Been Updated</title>
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
          .membership-id {
            background: #f8f9fa;
            border: 2px solid #e74c3c;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 20px 0;
          }
          .button {
            display: inline-block;
            background-color: #e74c3c;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px 5px;
            font-weight: bold;
          }
          .footer { 
            text-align: center; 
            padding: 20px 0; 
            border-top: 1px solid #eee; 
            color: #666; 
            font-size: 14px; 
          }
          .unsubscribe {
            font-size: 12px;
            color: #999;
            margin-top: 10px;
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
            <h2>Important Notice: Membership ID Update</h2>
            
            <p>Hello ${name},</p>
            
            <p>We're writing to inform you that your IEDC membership ID has been updated in our system.</p>
            
            <div class="membership-id">
              <h3 style="color: #e74c3c; margin: 0 0 10px 0;">📌 Your Updated Membership ID</h3>
              <p style="font-size: 1.2em; margin: 0;">Previous ID: <span style="text-decoration: line-through;">${oldMembershipId}</span></p>
              <p style="font-size: 1.5em; font-weight: bold; color: #e74c3c; margin: 10px 0 0 0;">New ID: ${newMembershipId}</p>
            </div>
            
            <p><strong>Why has my membership ID changed?</strong></p>
            <p>We have updated our membership ID system to better identify lateral entry students. Your new ID includes an "L" after your department code to indicate lateral entry status.</p>
            
            <p><strong>What do I need to do?</strong></p>
            <p>Please use your new membership ID for all future IEDC-related activities, events, and communications. Your previous ID will no longer be valid.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              ${
                googleGroupsUrl
                  ? `<a href="${googleGroupsUrl}" class="button">Join Google Groups Community</a>`
                  : ""
              }
              <a href="${
                process.env.CLIENT_URL || "https://www.iedclbscek.in"
              }" class="button">Visit IEDC Website</a>
            </div>
            
            <p>If you have any questions or concerns about this update, please feel free to contact us.</p>
            
            <p>Thank you for being an active part of the Innovation and Entrepreneurship Development Centre.</p>
            
            <p>Best regards,<br/>IEDC Team</p>
          </div>
          <div class="footer">
            <p>IEDC LBSCEK</p>
            <p>LBS College of Engineering, Kasaragod, Kerala</p>
            <div class="unsubscribe">
              <p><a href="${
                process.env.UNSUBSCRIBE_URL
              }">Unsubscribe</a> | <a href="${
      process.env.CONTACT_URL || "mailto:" + process.env.EMAIL_USER
    }">Contact Us</a></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      IEDC LBSCEK - Important Notice: Membership ID Update
      
      Hello ${name},
      
      We're writing to inform you that your IEDC membership ID has been updated in our system.
      
      Previous ID: ${oldMembershipId}
      New ID: ${newMembershipId}
      
      Why has my membership ID changed?
      We have updated our membership ID system to better identify lateral entry students. Your new ID includes an "L" after your department code to indicate lateral entry status.
      
      What do I need to do?
      Please make note of your new membership ID for all future IEDC-related activities, events, and communications. Your previous ID will no longer be valid.
      
      If you have any questions or concerns about this update, please feel free to contact us.
      
      Thank you for being an active part of the Innovation and Entrepreneurship Development Centre.
      
      Best regards,
      IEDC Team
      
      Unsubscribe: ${process.env.UNSUBSCRIBE_URL}
    `,
  };

  return await queueEmail(mailOptions);
};

// Close transporter when done (call this when shutting down)
export const closeTransporter = () => {
  if (globalTransporter) {
    globalTransporter.close();
    globalTransporter = null;
    console.log("📧 Email transporter closed");
  }
};
