const { format, createLogger, transports } = require("winston");
const { combine, timestamp, printf, prettyPrint } = format;
require("winston-daily-rotate-file");

//DailyRotateFile func()
const fileRotateTransport = new transports.DailyRotateFile({
  filename: "logs/proxy-server-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "14d",
});

const logger = createLogger({
  level: "debug",
  format: combine(
    timestamp({
      format: "MMM-DD-YYYY HH:mm:ss",
    }),
    prettyPrint()
  ),
  transports: [fileRotateTransport],
});

module.exports = logger;