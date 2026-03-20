const cron = require("node-cron");
const { getDays, startodDay, endofDay } = require("data-fns");
const ConnectionRequest = require("../models/connectionRequest");
cron.schedule("* * * * * *", () => {
  //   console.log("Hello YC ," + new Date());
try {
    yestarday =subDays(new Date(), 1);

  const yesterdayStart = startodDay(yestarday);
  const yesterdayEnd = endofDay(yestarday);

  const pendingRequests = ConnectionRequestModel.find({
    status: "interested",
    createdAt: {
      $gte: yesterdayStart,
      $lt: yesterdayEnd,
    },
  });
    
} catch (error) {
    
}
  
});
