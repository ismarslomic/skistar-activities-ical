import { SkistarDestination } from './types/external/SkistarDestination'
import { SkistarLanguage } from './types/external/SkistarLanguage'
import * as http from 'http'
import { CalendarService } from './service/CalendarService'
import { logger } from './logging/logger'
import { morganMiddleware } from './logging/morganMiddleware'

const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3001
const hostName: string = process.env.HOST_NAME ? process.env.HOST_NAME : 'localhost'
const calFileName: string = process.env.CAL_FILE_NAME ? process.env.CAL_FILE_NAME : 'skistar_calendar.ics'
const daysInFuture: number = process.env.DAYS_IN_FUTURE ? parseInt(process.env.DAYS_IN_FUTURE) : 14
const destination: SkistarDestination = process.env.DESTINATION
  ? SkistarDestination[process.env.DESTINATION]
  : SkistarDestination.Hemsedal
const language: SkistarLanguage = process.env.LANGUAGE ? SkistarLanguage[process.env.LANGUAGE] : SkistarLanguage.Norsk

const calendarService = new CalendarService(daysInFuture, destination, language, calFileName)

const main = async () => {
  try {
    const serverInstance = http
      .createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
        morganMiddleware(req, res, function () {
          calendarService.serveCalendar(res)
        })
      })
      .listen(port, hostName, () => {
        logger.info(`Serving Skistar activities calendar at http://${hostName}:${port}/${calFileName}`)
      })

    const shutdown = () => {
      logger.info('Closing the HTTP server...')

      serverInstance.close(() => {
        logger.info('HTTP server closed')
      })
    }

    process.on('SIGINT', shutdown)
    process.on('SIGTERM', shutdown)
  } catch (e) {
    logger.error('Failed to retrieve activities from Skistar API and create calendar', e)
  }
}

main()
