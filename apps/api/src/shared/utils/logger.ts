import winston from 'winston'

const logger = winston.createLogger({
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.colorize({ message: true, level: true }),
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level}: ${message}`
    })
  ),
  transports: [new winston.transports.Console()]
})

export { logger }
