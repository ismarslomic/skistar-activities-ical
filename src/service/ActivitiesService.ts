import { SkistarFilterOptions } from '../types/external/SkistarFilterOptions'
import { SkistarArea } from '../types/external/SkistarArea'
import { SkistarCategory } from '../types/external/SkistarCategory'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { SkistarActivity } from '../types/external/SkistarActivity'
import { SkistarOccurrence } from '../types/external/SkistarOccurrence'
import { ICalEventData } from 'ical-generator'
import { DateTime } from 'luxon'

export class ActivitiesService {
  static endpointUrl = 'https://www.skistar.com/__api/calendar/find'

  static async requestActivities(filterOptions: SkistarFilterOptions): Promise<ICalEventData[]> {
    console.debug(`Requesting activities from Skistar for filter ${JSON.stringify(filterOptions)}`)

    const requestBody = {
      fromDate: filterOptions.fromDate.toISODate(),
      toDate: filterOptions.toDate.toISODate(),
      destinationFilter: filterOptions.destinationFilter,
      areaFilter: filterOptions.areaFilter?.map((area: SkistarArea) => area.Info.Id),
      categoryFilter: filterOptions.categoryFilter?.map((category: SkistarCategory) => category.Id),
      skip: filterOptions.skip,
      take: filterOptions.take,
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': filterOptions.language.valueOf(),
      },
    }

    return new Promise((resolve, reject) => {
      axios
        .post<SkistarActivity[]>(ActivitiesService.endpointUrl, requestBody, config)
        .then((response: AxiosResponse<SkistarActivity[]>) => {
          console.debug('Reading successfully activities from Skistar API.')

          const events: ICalEventData[] = []
          response.data.forEach((skistarActivity: SkistarActivity) =>
            events.push(...mapToCalendarEvent(skistarActivity))
          )

          resolve(events)
        })
        .catch((error: AxiosError) => {
          console.error('Reading activities from Skistar API failed', error)
          reject(error.message)
        })
    })

    function mapToCalendarEvent(activity: SkistarActivity): ICalEventData[] {
      const localDateString: string = activity.Date // Måndag 17 april 2023
      const summary: string = activity.Heading
      const description: string = activity.Description
      const events: ICalEventData[] = []
      const imageUrl: string | null = activity.ImageUrl

      activity.Areas.forEach((activityArea: SkistarArea) => {
        const destinationName: string = activityArea.Info.Name
        const uniqueOccurrences: SkistarOccurrence[] = getUniqueOccurrences(activityArea.Occurrences)

        uniqueOccurrences.forEach((occurrence: SkistarOccurrence) => {
          let startTime: DateTime
          let endTime: DateTime

          if (occurrence.StartTime != null && occurrence.EndTime != null) {
            startTime = ActivitiesService.cestDateTime(localDateString, occurrence.StartTime)
            endTime = ActivitiesService.cestDateTime(localDateString, occurrence.EndTime)
          } else {
            // handles whole day events
            startTime = ActivitiesService.cestDateTime(localDateString, '00:00')
            endTime = ActivitiesService.cestDateTime(localDateString, '00:00')
          }

          const isWholeDay: boolean = occurrence.IsWholeDay
          const location: string = occurrence.LocationDescription ? occurrence.LocationDescription : destinationName

          const event: ICalEventData = {
            start: startTime,
            end: endTime,
            summary: summary,
            description: description,
            location: location,
            allDay: isWholeDay,
            attachments: imageUrl ? [imageUrl] : [],
          }

          events.push(event)
        })
      })

      return events
    }

    // Remove duplicate occurrences with the same start and end time
    function getUniqueOccurrences(occurrences: SkistarOccurrence[]): SkistarOccurrence[] {
      return occurrences.filter((occurrence: SkistarOccurrence, index: number): boolean => {
        return (
          occurrences.findIndex(
            (otherOccurrence: SkistarOccurrence) =>
              otherOccurrence.StartTime === occurrence.StartTime &&
              otherOccurrence.EndTime === occurrence.EndTime &&
              otherOccurrence.LocationDescription === occurrence.LocationDescription
          ) === index
        )
      })
    }
  }

  /**
   *
   * @param date as a string in the format "cccc d LLLL yyyy" in swedish, example "Lördag 1 april 2023"
   * @param time as a string in the format "HH:mm", example "10:00"
   * @returns a DateTime object in CEST timezone, example "2023-04-01T10:00:00+02:00"
   */
  static cestDateTime(date: string, time: string): DateTime {
    const localDateTime = `${date} ${time} Europe/Oslo`

    // Example: Måndag 17 april 2023 10:00 Europe/Oslo
    const localFormat = 'cccc d LLLL yyyy HH:mm z'

    return DateTime.fromFormat(localDateTime, localFormat, { locale: 'sv' })
  }
}
