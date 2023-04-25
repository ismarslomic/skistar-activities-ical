import ical, { ICalCalendar, ICalEventData } from 'ical-generator'
import { ActivitiesService } from './ActivitiesService'
import { DateTime } from 'luxon'
import { getVtimezoneComponent } from '@touch4it/ical-timezones'
import * as http from 'http'
import { SkistarDestination } from '../types/external/SkistarDestination'
import { SkistarLanguage } from '../types/external/SkistarLanguage'
import { logger } from '../logging/logger'

export class CalendarService {
  private readonly daysInFuture: number
  private readonly destination: SkistarDestination
  private readonly language: SkistarLanguage
  private readonly calFileName: string

  constructor(daysInFuture: number, destination: SkistarDestination, language: SkistarLanguage, calFileName: string) {
    this.daysInFuture = daysInFuture
    this.destination = destination
    this.language = language
    this.calFileName = calFileName
  }

  async createCalendar(): Promise<ICalCalendar> {
    try {
      const activityEvents: ICalEventData[] = await ActivitiesService.requestActivities({
        fromDate: DateTime.now(),
        toDate: DateTime.now().plus({ days: this.daysInFuture }),
        destinationFilter: this.destination,
        language: this.language,
      })
      logger.info(`Retrieved ${activityEvents.length} activity events from Skistar`)

      const destinationName = this.getDestinationName(this.destination)

      return ical({
        name: `Skistar activities in ${destinationName}`,
        events: activityEvents,
        prodId: { company: 'skistar.com', product: 'activities', language: 'NO' },
        timezone: {
          name: ActivitiesService.timeZone,
          generator: getVtimezoneComponent,
        },
      })
    } catch (e) {
      logger.error('Failed to retrieve activities from Skistar API and create the calendar', e)

      return ical({
        name: 'Skistar activities in Hemsedal',
        events: [],
        prodId: { company: 'skistar.com', product: 'activities', language: 'NO' },
        timezone: {
          name: 'Europe/Oslo',
          generator: getVtimezoneComponent,
        },
      })
    }
  }

  getDestinationName(value: string) {
    const indexOfValue = Object.values(SkistarDestination).indexOf(value as unknown as SkistarDestination)
    return Object.keys(SkistarDestination)[indexOfValue]
  }

  async serveCalendar(res: http.ServerResponse): Promise<ICalCalendar> {
    const calendar: ICalCalendar = await this.createCalendar()
    return calendar.serve(res, this.calFileName)
  }
}
