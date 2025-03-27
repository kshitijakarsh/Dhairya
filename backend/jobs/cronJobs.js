import cron from "node-cron";
import { updateExpiredMemberships } from "../services/membershipService.js";

// Schedule the function to run every day at midnight (00:00)
cron.schedule("0 0 * * *", updateExpiredMemberships, {
  scheduled: true,
  timezone: "Asia/Kolkata" // Adjust as needed
});
