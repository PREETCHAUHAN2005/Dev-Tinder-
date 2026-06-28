// Mock Email Service to prevent crashes in Cron Jobs
const run = async (subject, body) => {
  try {
    console.log(`[MOCK EMAIL SENT]`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body || "No Body Provided"}`);
    return { success: true, message: "Email logged successfully (Mock Mode)" };
  } catch (error) {
    console.error("Mock Email sending failed:", error.message);
    throw error;
  }
};

module.exports = {
  run,
};
