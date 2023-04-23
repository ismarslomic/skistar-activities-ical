import { ActivitiesService } from '../../src/service/ActivitiesService'
import { SkistarDestination } from '../../src/types/external/SkistarDestination'
import { SkistarLanguage } from '../../src/types/external/SkistarLanguage'
import * as mockResponse from '../../__mocks__/activitiesResponseMock'
import { DateTime } from 'luxon'
import { ICalEventData } from 'ical-generator'
import nock = require('nock')

describe('ActivitiesService requestActivities', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  describe('given 200 response with non empty list with activities', () => {
    beforeEach(() => {
      nock(ActivitiesService.endpointUrl).post('').reply(200, mockResponse.activities)
    })

    test('events are returned from the service', async () => {
      const events: ICalEventData[] = await ActivitiesService.requestActivities({
        fromDate: DateTime.fromISO('2023-03-13'),
        toDate: DateTime.fromISO('2023-03-13'),
        destinationFilter: SkistarDestination.Hemsedal,
        language: SkistarLanguage.Norsk,
      })

      expect(events).toHaveLength(18)
    })
  })

  describe('given 200 response with non empty list with activities and first activity containing duplicate occurrence', () => {
    beforeEach(() => {
      nock(ActivitiesService.endpointUrl).post('').reply(200, mockResponse.activities)
    })

    test('mapping to event with single occurrence', async () => {
      const events: ICalEventData[] = await ActivitiesService.requestActivities({
        fromDate: DateTime.fromISO('2023-03-13'),
        toDate: DateTime.fromISO('2023-03-13'),
        destinationFilter: SkistarDestination.Hemsedal,
        language: SkistarLanguage.Norsk,
      })

      const actualEvent: ICalEventData = events[0]
      expect((actualEvent.start as DateTime).toISO()).toBe(DateTime.fromISO('2023-03-13T13:30:00+01:00').toISO())
      expect((actualEvent.end as DateTime).toISO()).toBe(DateTime.fromISO('2023-03-13T14:00:00+01:00').toISO())
      expect(actualEvent.summary).toBe('Meet Valle')
      expect(actualEvent.description).toBe(
        'Say hello to Valle and get to know him even better. It is a perfect opportunity to ask questions, take a picture or hear about his adventures.'
      )
      expect(actualEvent.location).toBe("Valle's stage, Children's area")
      expect(actualEvent.allDay).toBe(false)
    })
  })

  describe('given 200 response with non empty list with activities and second activity is on multiple areas lasting whole day', () => {
    beforeEach(() => {
      nock(ActivitiesService.endpointUrl).post('').reply(200, mockResponse.activities)
    })

    test('mapping to to multiple events for activity areas', async () => {
      const events: ICalEventData[] = await ActivitiesService.requestActivities({
        fromDate: DateTime.fromISO('2023-03-13'),
        toDate: DateTime.fromISO('2023-03-13'),
        destinationFilter: SkistarDestination.Hemsedal,
        language: SkistarLanguage.Norsk,
      })

      const firstEvent: ICalEventData = events[1]
      expect((firstEvent.start as DateTime).toISO()).toBe(DateTime.fromISO('2023-03-13T00:00:00+01:00').toISO())
      expect((firstEvent.end as DateTime).toISO()).toBe(DateTime.fromISO('2023-03-13T00:00:00+01:00').toISO())
      expect(firstEvent.summary).toBe('Climbing and rappelling at Fjellkafeen')
      expect(firstEvent.location).toBe('At Fjellkafeen')
      expect(firstEvent.allDay).toBe(true)

      const secondEvent: ICalEventData = events[2]
      expect((secondEvent.start as DateTime).toISO()).toBe(DateTime.fromISO('2023-03-13T00:00:00+01:00').toISO())
      expect((secondEvent.end as DateTime).toISO()).toBe(DateTime.fromISO('2023-03-13T00:00:00+01:00').toISO())
      expect(secondEvent.summary).toBe('Climbing and rappelling at Fjellkafeen')
      expect(secondEvent.location).toBe('At Fjellkafeen')
      expect(secondEvent.allDay).toBe(true)
    })
  })

  describe('given 404 not found response with error message', () => {
    beforeEach(() => {
      nock(ActivitiesService.endpointUrl).post('').reply(404)
    })

    test('reject with error message shall be returned', async () => {
      await expect(
        ActivitiesService.requestActivities({
          fromDate: DateTime.fromISO('2023-03-13'),
          toDate: DateTime.fromISO('2023-03-13'),
          destinationFilter: SkistarDestination.Hemsedal,
          language: SkistarLanguage.Norsk,
        })
      ).rejects.toMatch('Request failed with status code 404')
    })
  })
})

describe('ActivitiesService cestDateTime', () => {
  test('should return CEST DateTime when day above 9, winter time (+01:00)', async () => {
    const actualDateTime: DateTime = ActivitiesService.cestDateTime('Fredag 17 mars 2023', '09:00')
    expect(actualDateTime.toISO()).toBe('2023-03-17T09:00:00.000+01:00')
  })

  test('should return CEST DateTime when day below 10 is not padded with 0, summer time (+02:00)', async () => {
    const actualDateTime: DateTime = ActivitiesService.cestDateTime('Lördag 1 april 2023', '09:00')
    expect(actualDateTime.toISO()).toBe('2023-04-01T09:00:00.000+02:00')
  })
})
