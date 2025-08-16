import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import Registration from "./models/Registration.js";
import { sendMembershipIdEmail } from "./utils/emailService.js";

async function main() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to MongoDB");

  const registrations = await Registration.find({ email: { $exists: true, $ne: null }, membershipId: { $exists: true, $ne: null } });
  console.log(`Found ${registrations.length} registrations.`);

  for (const reg of registrations) {
    const name = `${reg.firstName} ${reg.lastName}`;
    const email = reg.email;
    const membershipId = reg.membershipId;
    try {
      const result = await sendMembershipIdEmail(email, name, membershipId);
      if (result.success) {
        console.log(`✅ Email sent to ${email} (${membershipId})`);
      } else {
        console.error(`❌ Failed to send to ${email}: ${result.error}`);
      }
    } catch (err) {
      console.error(`❌ Exception for ${email}:`, err);
    }
  }

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
