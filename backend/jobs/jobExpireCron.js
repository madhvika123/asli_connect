const cron = require("node-cron");
const jobModel = require("../models/jobModel");

cron.schedule("0 0 * * *", async () => {
  console.log("Running job expiry cron...");
  await jobModel.updateMany({ postValidityDate: { $lt: new Date() }, status: "open" },{ status: "expired" });
});
