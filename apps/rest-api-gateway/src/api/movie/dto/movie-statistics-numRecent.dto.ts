import { ApiProperty } from '@nestjs/swagger'
import { Expose, Transform, Type } from 'class-transformer'

export class MovieStatisticsNumRecentDto {
  @ApiProperty({ example: '2024-09' })
  @Expose()
  currentDate: string

  @ApiProperty({ example: 4.5 })
  @Expose()
  @Type(() => String)
  numStars: number
}
