import winston from "winston";
import { format } from "date-fns";

const getLogFileName = () => {
  const now = new Date();
  return `snl_${format(now, "yyyyMMddHHmmss")}.txt`;
};

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, message }) => {
      return `${timestamp} - ${message}`;
    })
  ),
  transports: [
    new winston.transports.File({
      filename: `logs/${getLogFileName()}`,
      level: "info",
    }),
  ],
});

export const LoggingService = {
  logGameEvent: (message: string) => {
    logger.info(message);
  },

  getLogFiles: async (): Promise<string[]> => {
    // This would need to be implemented based on your file system access
    // For browser-based storage, we might need to use IndexedDB or similar
    return [];
  },

  getLogContent: async (filename: string): Promise<string> => {
    // Implementation would depend on how we're storing logs
    return "";
  },
};
