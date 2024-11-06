import { Expose, Transform, Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { MovieStatisticsNumRecentDto } from './movie-statistics-numRecent.dto'

class numSpecialPoint {
  @Expose()
  @Type(() => String)
  PLANNING_INTENT: string
  @Expose()
  @Type(() => String)
  DIRECTORS_DIRECTION: string
  @Expose()
  @Type(() => String)
  ACTING_SKILLS: string
  @Expose()
  @Type(() => String)
  SCENARIO: string
  @Expose()
  @Type(() => String)
  OST: string
  @Expose()
  @Type(() => String)
  SOCIAL_ISSUES: string
  @Expose()
  @Type(() => String)
  VISUAL_ELEMENT: string
  @Expose()
  @Type(() => String)
  SOUND_ELEMENT: string
}

class numAge {
  @Expose()
  @Type(() => String)
  TEENS: string
  @Expose()
  @Type(() => String)
  TWENTIES: string
  @Expose()
  @Type(() => String)
  THIRTIES: string
  @Expose()
  @Type(() => String)
  FORTIES: string
  @Expose()
  @Type(() => String)
  FIFTIES: string
  @Expose()
  @Type(() => String)
  SIXTIES: string
  @Expose()
  @Type(() => String)
  SEVENTIES: string
  @Expose()
  @Type(() => String)
  EIGHTIES: string
  @Expose()
  @Type(() => String)
  NINETIES: string
}

class numPastValuation {
  @Expose()
  @Type(() => String)
  POSITIVE: string
  @Expose()
  @Type(() => String)
  NEGATIVE: string
  @Expose()
  @Type(() => String)
  NOT_SURE: string
}

class numPresentValuation {
  @Expose()
  @Type(() => String)
  POSITIVE: string
  @Expose()
  @Type(() => String)
  NEGATIVE: string
  @Expose()
  @Type(() => String)
  NOT_SURE: string
}

class numGender {
  @Expose()
  @Type(() => String)
  MALE: string
  @Expose()
  @Type(() => String)
  FEMALE: string
}

export class MovieStatisticsDto {
  @Expose()
  @ApiProperty({ example: '1' })
  id: string

  @Expose()
  @ApiProperty({ type: [MovieStatisticsNumRecentDto] })
  @Type(() => MovieStatisticsNumRecentDto)
  numRecentStars: MovieStatisticsNumRecentDto[]

  @Expose()
  @ApiProperty({ example: 4.5 })
  @Type(() => String)
  numStars: number

  @Expose()
  @ApiProperty({ example: 5 })
  numStarsParticipants: number

  @Expose()
  @ApiProperty({
    example: {
      PLANNING_INTENT: 3,
      DIRECTORS_DIRECTION: 6,
      ACTING_SKILLS: 1,
      SCENARIO: 20,
      OST: 10,
      SOCIAL_ISSUES: 4,
      VISUAL_ELEMENT: 5,
      SOUND_ELEMENT: 5,
    },
  })
  @Type(() => numSpecialPoint)
  numSpecialPoint: numSpecialPoint

  @Expose()
  @ApiProperty({
    example: {
      POSITIVE: 2,
      NEGATIVE: 6,
      NOT_SURE: 5,
    },
  })
  @Type(() => numPastValuation)
  numPastValuation: numPastValuation

  @Expose()
  @ApiProperty({
    example: {
      POSITIVE: 5,
      NEGATIVE: 3,
      NOT_SURE: 6,
    },
  })
  @Type(() => numPresentValuation)
  numPresentValuation: numPresentValuation

  @Expose()
  @ApiProperty({
    example: {
      MALE: 1,
      FEMALE: 2,
    },
  })
  @Type(() => numGender)
  numGender: numGender

  @Expose()
  @ApiProperty({
    example: {
      TEENS: 24,
      TWENTIES: 148,
      THIRTIES: 34,
      FORTIES: 1,
      FIFTIES: 5,
      SIXTIES: 10,
      SEVENTIES: 0,
      EIGHTIES: 0,
      NINETIES: 2,
    },
  })
  @Type(() => numAge)
  numAge: numAge

  @Expose()
  @ApiProperty({ example: '2024-09' })
  currentDate: string
}
