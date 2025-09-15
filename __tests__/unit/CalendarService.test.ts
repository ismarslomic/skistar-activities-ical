import nock = require('nock')
import { ActivitiesService } from '../../src/service/ActivitiesService'
import * as mockResponse from '../../__mocks__/activitiesResponseMock'
import { CalendarService } from '../../src/service/CalendarService'
import { SkistarDestination } from '../../src/types/external/SkistarDestination'
import { SkistarLanguage } from '../../src/types/external/SkistarLanguage'
import { ICalCalendar } from 'ical-generator'
import { Settings } from 'luxon'

describe('CalendarService createCalendar', () => {
  afterEach(() => {
    nock.cleanAll()
    jest.clearAllMocks()
    Settings.now = () => new Date().valueOf()
  })

  describe('given 200 response with non empty list with activities', () => {
    beforeEach(() => {
      // mock HTTP request
      nock(ActivitiesService.endpointUrl).post('').reply(200, mockResponse.activities)
      // @ts-expect-error "crypto" is not defined in Node.js"
      jest.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue('mock-uuid-1234')
      Settings.now = () => new Date('2023-04-24T13:00:00.000+02:00').valueOf()
    })

    test('calendar with 18 events are returned', async () => {
      const calendarService: CalendarService = new CalendarService(
        14,
        SkistarDestination.Åre,
        SkistarLanguage.Svenska,
        'calendar.ics'
      )

      const calendar: ICalCalendar = await calendarService.createCalendar()
      expect(calendar.events().length).toBe(18)

      expect(calendar.toString()).toMatchSnapshot()
    })
  })

  describe('given 404 not found response with error message', () => {
    beforeEach(() => {
      nock(ActivitiesService.endpointUrl).post('').reply(404)
    })

    test('calendar with empty list of events is returned', async () => {
      const calendarService: CalendarService = new CalendarService(
        14,
        SkistarDestination.Hemsedal,
        SkistarLanguage.Norsk,
        'calendar.ics'
      )

      const calendar: ICalCalendar = await calendarService.createCalendar()
      expect(calendar.events().length).toBe(0)
    })
  })
})
