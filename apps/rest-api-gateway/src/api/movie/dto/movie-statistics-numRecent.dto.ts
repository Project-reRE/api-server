import { ApiProperty } from '@nestjs/swagger'

export class MovieStatisticsNumRecentDto {
  @ApiProperty({ example: '2024-09' })
  currentDate: string

  @ApiProperty({ example: 4.5 })
  numStars: number
}
