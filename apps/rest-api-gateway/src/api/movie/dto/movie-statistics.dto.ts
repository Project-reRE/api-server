import { ApiProperty } from '@nestjs/swagger'

export class MovieStatisticsDto {
  @ApiProperty({ example: '1' })
  id: string

  @ApiProperty({
    example: {
      '2024-04': 4.0,
      '2024-05': 3.5,
      '2024-06': 4.5,
      '2024-07': 4.2,
      '2024-08': 5,
    },
  })
  numRecentStars: any

  @ApiProperty({ example: 4.5 })
  numStars: number

  @ApiProperty({ example: 5 })
  numStarsParticipants: number

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
  numSpecialPoint: any

  @ApiProperty({
    example: {
      POSITIVE: 2,
      NEGATIVE: 6,
      NOT_SURE: 5,
    },
  })
  numPastValuation: any

  @ApiProperty({
    example: {
      POSITIVE: 5,
      NEGATIVE: 3,
      NOT_SURE: 6,
    },
  })
  numPresentValuation: any

  @ApiProperty({
    example: {
      MALE: 1,
      FEMALE: 2,
    },
  })
  numGender: any

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
  numAge: any

  @ApiProperty({ example: '2024-09' })
  targetDate: string
}