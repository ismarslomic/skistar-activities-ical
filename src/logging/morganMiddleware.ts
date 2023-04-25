import { logger } from './logger'
import morgan from 'morgan'

const stream = {
  write: (message) => {
    // Make the message a JSON object
    const data = JSON.parse(message)

    // Use the http severity
    logger.http(`HTTP Request`, data)
  },
}

/**
 * Skip logging for all other environments than production
 */
const skip = () => {
  const env = process.env.NODE_ENV || 'development'
  return env !== 'production'
}

const jsonTokens = (tokens, req, res) => {
  return JSON.stringify({
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: Number.parseFloat(tokens.status(req, res)),
    content_length: tokens.res(req, res, 'content-length'),
    response_time: Number.parseFloat(tokens['response-time'](req, res)),
  })
}

export const morganMiddleware = morgan(jsonTokens, { stream, skip })
