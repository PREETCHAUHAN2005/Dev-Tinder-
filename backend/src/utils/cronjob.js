const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("data-fns");
const sendEmail = require("./sendEmail");
const ConnectionRequestModel = require("../models/connectionRequest")
// const ConnectionRequest = require("../models/connectionRequest");
cron.schedule("0 8 * * *", async () => {
  //   console.log("Hello YC ," + new Date());
  try {
     const yesterday = subDays(new Date(), 1);

    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequests = await ConnectionRequestModel.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");

    const listOfEmails = new Set(
      pendingRequests.map((req) => req.toUserId.emailId)
    );
    for (const email of listOfEmails) {
      const res = await sendEmail.run(
        "New friend Request pending for "+ email + 
        "There are so many friend request pending ,please login to devtinder.in and accept all the friend request");
    }
  } catch (err) {
    console.error(err); 
  }
});
