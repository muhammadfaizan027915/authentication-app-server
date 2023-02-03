const scheduler = require("node-schedule");

module.exports = (name) => {
  const start = new Date(Date.now()),
    end = new Date(start.getTime() + 10000),
    rule = "*/5 * * * * *";

  return scheduler.scheduleJob({ start, end, rule }, (fireDate) => {
    console.log(`${name} is written at ${fireDate.toLocaleTimeString()}`);
  });
};
