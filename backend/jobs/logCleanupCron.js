const cron = require("node-cron");
const fs = require("fs/promises");
const path = require("path");

const LOG_DIR = path.join(__dirname, "../logs");

const ENV = process.env.NODE_ENV || "development";
const isDev = ENV !== "production";

/* retention */
const RETENTION_TIME = isDev
  ? 5 * 60 * 1000      // 5 minutes dev
  : 7 * 24 * 60 * 60 * 1000; // 7 days prod

const runLogCleanup = async () => {
  try {
    const files = await fs.readdir(LOG_DIR);
    const now = Date.now();

    for (const file of files) {
      try {
        // skip active logs
        if (
          file === "combined.log" ||
          file === "error.log"
        ) continue;

        const filePath = path.join(LOG_DIR, file);
        const stats = await fs.stat(filePath);

        const fileAge = now - stats.mtimeMs;

        if (fileAge > RETENTION_TIME) {
          await fs.unlink(filePath);
          console.log(`🧹 [${ENV}] Deleted: ${file}`);
        }
      } catch {
        console.log(`⚠ Skipped file: ${file}`);
      }
    }

  } catch (err) {
    console.error("Cleanup error:", err.message);
  }
};

/* run once */
runLogCleanup();

/* schedule */
const CRON_TIME = isDev
  ? "*/5 * * * *"   // every 5 min dev
  : "0 0 * * *";    // daily prod

cron.schedule(CRON_TIME, runLogCleanup);

module.exports = runLogCleanup;