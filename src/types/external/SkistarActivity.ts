import { SkistarCategory } from './SkistarCategory'
import { SkistarDestination } from './SkistarDestination'
import { SkistarArea } from './SkistarArea'

export type SkistarActivity = {
  Id: string
  Destination: SkistarDestination
  Heading: string
  Date: string
  DayOfMonth: string
  Month: string
  Times: string[]
  Description: string
  ImageUrl?: string
  Categories: SkistarCategory[]
  Tags: string[]
  MoreInfoUrl: null | string
  MoreInfoUrlText: null | string
  BookingUrl: null
  Areas: SkistarArea[]
  NumberOfOccurrences: number
  HasMultipleAdditionalTimes: boolean
  AdditionalTimesCount: null
}
