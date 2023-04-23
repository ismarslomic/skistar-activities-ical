import { SkistarGeoLocation } from './SkistarGeoLocation'

export type SkistarOccurrence = {
  IsWholeDay: boolean
  StartTime: string
  EndTime: string
  GeoLocation: SkistarGeoLocation | null
  LocationDescription: null | string
}
