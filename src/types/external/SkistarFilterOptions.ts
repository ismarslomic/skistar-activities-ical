import { SkistarCategory } from './SkistarCategory'
import { SkistarArea } from './SkistarArea'
import { SkistarDestination } from './SkistarDestination'
import { SkistarLanguage } from './SkistarLanguage'
import { DateTime } from 'luxon'

export type SkistarFilterOptions = {
  fromDate: DateTime
  toDate: DateTime
  destinationFilter: SkistarDestination
  areaFilter?: SkistarArea[]
  categoryFilter?: SkistarCategory[]
  skip?: number
  take?: number
  language: SkistarLanguage
}
