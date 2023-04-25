import winston, { transports } from 'winston'

const { combine, timestamp, colorize, align, simple, errors, json } = winston.format

// Define your severity levels.
// With them, You can create log files,
// see or hide levels based on the running ENV.
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
}

// Define different colors for each level.
// Colors make the log message more visible,
// adding the ability to focus or ignore messages.
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
}

// Tell winston that you want to link the colors
// defined above to the severity levels.
winston.addColors(colors)

// See https://github.com/winstonjs/logform
const customConsoleFormat: winston.Logform.Format = combine(
  timestamp({ format: 'DD. MMM YYYY HH:mm:ss.SSS Z' }),
  colorize({ all: true }),
  align(),
  simple(),
  errors({ stack: true })
)

// See https://github.com/winstonjs/logform
const jsonFormat: winston.Logform.Format = combine(timestamp(), json(), errors({ stack: true }))

const logFormatForEnv = (): winston.Logform.Format => {
  if (process.env.NODE_ENV === 'production') {
    return jsonFormat
  } else {
    return customConsoleFormat
  }
}

/**
 * Return instance of Winston logger with appropriate log format for specific
 * runtime environment.
 *
 * See https://github.com/winstonjs/winston
 */
export const logger: winston.Logger = winston.createLogger({
  // add extra metadata to logs
  defaultMeta: {
    service: 'skistar-activites-ical',
  },

  // log only if info.level is less than or equal to this level
  level: process.env.LOG_LEVEL || 'http',

  // output logs to console/stdout with appropriate log format based on runtime environment
  transports: [new transports.Console({ format: logFormatForEnv() })],

  // dont exit on uncaught exceptions
  exitOnError: false,

  // catch and log uncaught exception events
  handleExceptions: true,

  // add custom level severities
  levels,
})
