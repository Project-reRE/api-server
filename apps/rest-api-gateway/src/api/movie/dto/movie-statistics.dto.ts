import { Expose, Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { MovieStatisticsNumRecentDto } from './movie-statistics-numRecent.dto'

class numSpecialPoint {
  @Expose()
  @Type(() => String)
  @ApiProperty({ type: String })
  PLANNING_INTENT: string
  @Expose()
  @Type(() => String)
  @ApiProperty({ type: String })
  DIRECTORS_DIRECTION: string
  @Expose()
  @Type(() => String)
  @ApiProperty({ type: String })
  ACTING_SKILLS: string
  @Expose()
  @Type(() => String)
  @ApiProperty({ type: String })
  SCENARIO: string
  @Expose()
  @Type(() => String)
  @ApiProperty({ type: String })
  OST: string
  @Expose()
  @Type(() => String)
  @ApiProperty({ type: String })
  SOCIAL_ISSUES: string
  @Expose()
  @Type(() => String)
  @ApiProperty({ type: String })
  VISUAL_ELEMENT: string
  @Expose()
  @Type(() => String)
  @ApiProperty({ type: String })
  SOUND_ELEMENT: string
}

class numAge {
  @Expose()
  @ApiProperty({ type: String })
  @Type(() => String)
  TEENS: string
  @Expose()
  @Type(() => String)
  @ApiProperty({ type: String })
  TWENTIES: string
  @Expose()
  @Type(() => String)
  @ApiProperty({ type: String })
  THIRTIES: string
  @Expose()
  @Type(() => String)
  @ApiProperty({ type: String })
  FORTIES: string
  @Expose()
  @Type(() => String)
  @ApiProperty({ type: String })
  FIFTIES: string
  @Expose()
  @Type(() => String)
  @ApiProperty({ type: String })
  SIXTIES: string
  @Expose()
  @Type(() => String)
  @ApiProperty({ type: String })
  SEVENTIES: string
  @Expose()
  @Type(() => String)
  @ApiProperty({ type: String })
  EIGHTIES: string
  @Expose()
  @Type(() => String)
  @ApiProperty({ type: String })
  NINETIES: string
}

class numPastValuation {
  @Expose()
  @ApiProperty({ type: String })
  @Type(() => String)
  POSITIVE: string
  @Expose()
  @ApiProperty({ type: String })
  @Type(() => String)
  NEGATIVE: string
  @Expose()
  @ApiProperty({ type: String })
  @Type(() => String)
  NOT_SURE: string
}

export class numSpecialPointTopThree {
  @ApiProperty({ type: String })
  @Type(() => String)
  @Expose()
  rank: number

  @ApiProperty({ type: String })
  @Type(() => String)
  @Expose()
  type: string

  @ApiProperty({ type: String })
  @Type(() => String)
  @Expose()
  value: string
}

class numPresentValuation {
  @Expose()
  @ApiProperty({ type: String })
  @Type(() => String)
  POSITIVE: string
  @Expose()
  @ApiProperty({ type: String })
  @Type(() => String)
  NEGATIVE: string
  @Expose()
  @ApiProperty({ type: String })
  @Type(() => String)
  NOT_SURE: string
}

class numGender {
  @Expose()
  @ApiProperty({ type: String })
  @Type(() => String)
  MALE: string
  @Expose()
  @ApiProperty({ type: String })
  @Type(() => String)
  FEMALE: string
}

export class MovieStatisticsDto {
  @Expose()
  @ApiProperty({ type: String })
  id: string

  @Expose()
  @ApiProperty({ type: [MovieStatisticsNumRecentDto] })
  @Type(() => MovieStatisticsNumRecentDto)
  numRecentStars: MovieStatisticsNumRecentDto[]

  @Expose()
  @ApiProperty({ type: String })
  @Type(() => String)
  numStars: number

  @Expose()
  @ApiProperty({ type: Number })
  numStarsParticipants: number

  @Expose()
  @ApiProperty({
    type: numSpecialPoint,
  })
  @Type(() => numSpecialPoint)
  numSpecialPoint: numSpecialPoint

  @Expose()
  @ApiProperty({
    type: numPastValuation,
  })
  @Type(() => numPastValuation)
  numPastValuation: numPastValuation

  @Expose()
  @ApiProperty({
    type: numPresentValuation,
  })
  @Type(() => numPresentValuation)
  numPresentValuation: numPresentValuation

  @Expose()
  @ApiProperty({
    type: numGender,
  })
  @Type(() => numGender)
  numGender: numGender

  @Expose()
  @ApiProperty({
    type: numAge,
  })
  @Type(() => numAge)
  numAge: numAge

  @Expose()
  @ApiProperty({ example: '2024-09' })
  currentDate: string

  @Expose()
  @ApiProperty({ type: numSpecialPointTopThree, isArray: true })
  @Type(() => numSpecialPointTopThree)
  numSpecialPointTopThree: numSpecialPointTopThree[]

  @Expose()
  @ApiProperty({ type: numSpecialPointTopThree, isArray: true })
  @Type(() => numSpecialPointTopThree)
  numPresentValuationPercent: numSpecialPointTopThree[]

  @Expose()
  @ApiProperty({ type: numSpecialPointTopThree, isArray: true })
  @Type(() => numSpecialPointTopThree)
  numGenderPercent: numSpecialPointTopThree[]

  @Expose()
  @ApiProperty({ type: numSpecialPointTopThree, isArray: true })
  @Type(() => numSpecialPointTopThree)
  numAgePercent: numSpecialPointTopThree[]
}
