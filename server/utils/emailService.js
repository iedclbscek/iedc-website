import nodemailer from "nodemailer";
import crypto from "crypto";
import fetch from "node-fetch"; // Add this dependency: npm install node-fetch

// Global transporter instance for connection pooling
let globalTransporter = null;

// Email sending queue for rate limiting
let emailQueue = [];
let isProcessingQueue = false;

// HTTP-based email services (for cloud deployment)
const sendViaHTTP = async (mailOptions) => {
  // Try SendGrid HTTP API first
  if (process.env.SENDGRID_API_KEY) {
    try {
      console.log("📧 Attempting SendGrid HTTP API...");
      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: mailOptions.to }],
              subject: mailOptions.subject,
            },
          ],
          from: {
            email: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            name: "IEDC LBSCEK",
          },
          content: [
            {
              type: "text/html",
              value: mailOptions.html,
            },
            {
              type: "text/plain",
              value: mailOptions.text,
            },
          ],
        }),
        timeout: 30000, // 30 second timeout
      });

      if (response.ok) {
        const messageId =
          response.headers.get("x-message-id") || "sendgrid-" + Date.now();
        console.log(`✅ SendGrid HTTP API success: ${messageId}`);
        return { success: true, messageId, service: "sendgrid-http" };
      } else {
        const errorText = await response.text();
        console.error(
          `❌ SendGrid HTTP API failed: ${response.status} - ${errorText}`
        );
      }
    } catch (error) {
      console.error("❌ SendGrid HTTP API error:", error.message);
    }
  }

  // Try Mailgun HTTP API as fallback
  if (process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN) {
    try {
      console.log("📧 Attempting Mailgun HTTP API...");
      const formData = new URLSearchParams();
      formData.append(
        "from",
        `IEDC LBSCEK <${
          process.env.EMAIL_FROM || "noreply@" + process.env.MAILGUN_DOMAIN
        }>`
      );
      formData.append("to", mailOptions.to);
      formData.append("subject", mailOptions.subject);
      formData.append("html", mailOptions.html);
      formData.append("text", mailOptions.text);

      const response = await fetch(
        `https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(
              `api:${process.env.MAILGUN_API_KEY}`
            ).toString("base64")}`,
          },
          body: formData,
          timeout: 30000,
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Mailgun HTTP API success: ${result.id}`);
        return { success: true, messageId: result.id, service: "mailgun-http" };
      } else {
        const errorText = await response.text();
        console.error(
          `❌ Mailgun HTTP API failed: ${response.status} - ${errorText}`
        );
      }
    } catch (error) {
      console.error("❌ Mailgun HTTP API error:", error.message);
    }
  }

  // Try Resend HTTP API as fallback
  if (process.env.RESEND_API_KEY) {
    try {
      console.log("📧 Attempting Resend HTTP API...");
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `IEDC LBSCEK <${
            process.env.EMAIL_FROM || "noreply@resend.dev"
          }>`,
          to: [mailOptions.to],
          subject: mailOptions.subject,
          html: mailOptions.html,
          text: mailOptions.text,
        }),
        timeout: 30000,
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Resend HTTP API success: ${result.id}`);
        return { success: true, messageId: result.id, service: "resend-http" };
      } else {
        const errorText = await response.text();
        console.error(
          `❌ Resend HTTP API failed: ${response.status} - ${errorText}`
        );
      }
    } catch (error) {
      console.error("❌ Resend HTTP API error:", error.message);
    }
  }

  return { success: false, error: "All HTTP email services failed" };
};

// Create email transporter with better cloud compatibility
const createTransporter = () => {
  if (globalTransporter) {
    return globalTransporter;
  }

  // In production/cloud environments, prefer HTTP APIs over SMTP
  if (
    process.env.NODE_ENV === "production" &&
    (process.env.SENDGRID_API_KEY ||
      process.env.MAILGUN_API_KEY ||
      process.env.RESEND_API_KEY)
  ) {
    console.log("📧 Using HTTP-based email services for cloud deployment");
    return null; // We'll use HTTP APIs instead
  }

  // Try SendGrid SMTP first if API key is available
  if (process.env.SENDGRID_API_KEY) {
    console.log("📧 Using SendGrid SMTP for email delivery");
    console.log(
      "🔑 SendGrid API Key:",
      process.env.SENDGRID_API_KEY
        ? `${process.env.SENDGRID_API_KEY.substring(0, 10)}...`
        : "Not set"
    );

    // Validate SendGrid API key format
    if (!process.env.SENDGRID_API_KEY.startsWith("SG.")) {
      console.warn(
        "⚠️ SendGrid API key doesn't start with 'SG.' - this may cause authentication issues"
      );
    }

    globalTransporter = nodemailer.createTransporter({
      host: "smtp.sendgrid.net",
      port: 587,
      secure: false, // Use STARTTLS
      auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY,
      },
      pool: true,
      maxConnections: 2, // Reduced for cloud
      maxMessages: 10, // Reduced for cloud
      connectionTimeout: 10000, // Reduced timeout
      greetingTimeout: 5000,
      socketTimeout: 10000,
      debug: process.env.NODE_ENV === "development",
      logger: process.env.NODE_ENV === "development",
    });
  }
  // Fallback to Gmail/SMTP configuration for development only
  else if (
    process.env.NODE_ENV === "development" &&
    process.env.EMAIL_USER &&
    process.env.EMAIL_PASS
  ) {
    console.log("📧 Using Gmail SMTP for email delivery (development only)");
    globalTransporter = nodemailer.createTransporter({
      service: "gmail",
      pool: true,
      maxConnections: 2,
      maxMessages: 10,
      connectionTimeout: 10000,
      greetingTimeout: 5000,
      socketTimeout: 10000,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  if (globalTransporter) {
    // Handle transporter errors
    globalTransporter.on("error", (error) => {
      console.error("❌ Transporter error:", error);
    });

    // Verify transporter connection with shorter timeout
    globalTransporter.verify({ timeout: 5000 }, (error, success) => {
      if (error) {
        console.error(
          "❌ Email transporter verification failed:",
          error.message
        );
        console.log("🔄 Will fallback to HTTP APIs");
      } else {
        console.log("✅ Email transporter verified and ready");
      }
    });
  }

  return globalTransporter;
};

// Enhanced email sending function with HTTP API fallback
const sendEmailWithRateLimit = async (mailOptions, retryCount = 0) => {
  const maxRetries = 2; // Reduced retries for faster failure
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // In production, try HTTP APIs first
  if (process.env.NODE_ENV === "production") {
    console.log("🌐 Attempting HTTP-based email delivery...");
    const httpResult = await sendViaHTTP(mailOptions);
    if (httpResult.success) {
      console.log(
        `📧 Email sent via HTTP API to ${mailOptions.to}:`,
        httpResult.messageId
      );
      return httpResult;
    }
    console.log("⚠️ HTTP APIs failed, trying SMTP fallback...");
  }

  // Try SMTP as fallback or primary (development)
  try {
    const transporter = createTransporter();
    if (!transporter) {
      return {
        success: false,
        error: "No transporter available and HTTP APIs failed",
      };
    }

    const result = await transporter.sendMail(mailOptions);
    console.log(
      `📧 Email sent via SMTP to ${mailOptions.to}:`,
      result.messageId
    );
    return { success: true, messageId: result.messageId, service: "smtp" };
  } catch (error) {
    console.error(
      `❌ SMTP error sending email to ${mailOptions.to}:`,
      error.message
    );

    // Retry logic for temporary failures (reduced retries)
    if (
      retryCount < maxRetries &&
      (error.code === "ETIMEDOUT" ||
        error.code === "ECONNRESET" ||
        error.code === "ECONNREFUSED" ||
        error.message.includes("Connection timeout") ||
        error.message.includes("timeout") ||
        (error.responseCode && error.responseCode >= 500))
    ) {
      console.log(
        `🔄 Retrying email to ${mailOptions.to} (attempt ${
          retryCount + 1
        }/${maxRetries})`
      );
      const baseDelay = 1000 * Math.pow(2, retryCount); // Faster retry
      await delay(baseDelay);
      return sendEmailWithRateLimit(mailOptions, retryCount + 1);
    }

    // If SMTP fails in production, try HTTP APIs as last resort
    if (process.env.NODE_ENV === "production" && retryCount === 0) {
      console.log("🔄 SMTP failed, trying HTTP APIs as last resort...");
      const httpResult = await sendViaHTTP(mailOptions);
      if (httpResult.success) {
        return httpResult;
      }
    }

    return { success: false, error: error.message };
  }
};

// Process email queue with better error handling
const processEmailQueue = async () => {
  if (isProcessingQueue || emailQueue.length === 0) {
    return;
  }

  isProcessingQueue = true;
  const delayMs = parseInt(process.env.EMAIL_BULK_DELAY_MS) || 500; // Faster processing

  while (emailQueue.length > 0) {
    const { mailOptions, resolve } = emailQueue.shift();
    try {
      const result = await sendEmailWithRateLimit(mailOptions);
      resolve(result);
    } catch (error) {
      console.error("❌ Queue processing error:", error);
      resolve({ success: false, error: error.message });
    }

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

// Test email service availability
export const testEmailService = async () => {
  console.log("🧪 Testing email service availability...");

  const testResults = {
    smtp: false,
    sendgridHttp: false,
    mailgunHttp: false,
    resendHttp: false,
  };

  // Test SMTP
  try {
    const transporter = createTransporter();
    if (transporter) {
      await transporter.verify();
      testResults.smtp = true;
      console.log("✅ SMTP service available");
    }
  } catch (error) {
    console.log("❌ SMTP service unavailable:", error.message);
  }

  // Test SendGrid HTTP
  if (process.env.SENDGRID_API_KEY) {
    try {
      const response = await fetch("https://api.sendgrid.com/v3/user/profile", {
        headers: { Authorization: `Bearer ${process.env.SENDGRID_API_KEY}` },
        timeout: 5000,
      });
      testResults.sendgridHttp = response.ok;
      console.log(
        response.ok
          ? "✅ SendGrid HTTP API available"
          : "❌ SendGrid HTTP API unavailable"
      );
    } catch (error) {
      console.log("❌ SendGrid HTTP API test failed:", error.message);
    }
  }

  // Test Mailgun HTTP
  if (process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN) {
    try {
      const response = await fetch(
        `https://api.mailgun.net/v3/domains/${process.env.MAILGUN_DOMAIN}`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `api:${process.env.MAILGUN_API_KEY}`
            ).toString("base64")}`,
          },
          timeout: 5000,
        }
      );
      testResults.mailgunHttp = response.ok;
      console.log(
        response.ok
          ? "✅ Mailgun HTTP API available"
          : "❌ Mailgun HTTP API unavailable"
      );
    } catch (error) {
      console.log("❌ Mailgun HTTP API test failed:", error.message);
    }
  }

  // Test Resend HTTP
  if (process.env.RESEND_API_KEY) {
    try {
      const response = await fetch("https://api.resend.com/domains", {
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
        timeout: 5000,
      });
      testResults.resendHttp = response.ok;
      console.log(
        response.ok
          ? "✅ Resend HTTP API available"
          : "❌ Resend HTTP API unavailable"
      );
    } catch (error) {
      console.log("❌ Resend HTTP API test failed:", error.message);
    }
  }

  return testResults;
};

// All your existing export functions remain the same...
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
            <h2>Welcome to IEDC, ${name}!</h2>
            
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

// Keep all your other existing export functions unchanged...
export const sendPasswordResetEmail = async (
  email,
  name,
  resetToken,
  isNewUser = false
) => {
  // Your existing implementation
};

export const generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const hashResetToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

// ... all other existing functions remain the same ...

// Close transporter when done (call this when shutting down)
export const closeTransporter = () => {
  if (globalTransporter) {
    globalTransporter.close();
    globalTransporter = null;
    console.log("📧 Email transporter closed");
  }
};
