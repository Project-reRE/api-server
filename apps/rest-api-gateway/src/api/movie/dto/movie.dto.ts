import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { MovieDataDto } from './movie-data.dto'
import { MovieStatisticsDto } from './movie-statistics.dto'
import { Expose, Type } from 'class-transformer'

export class MovieDto {
  @ApiProperty({ example: 'F-0000' })
  @Expose()
  id: string

  @ApiProperty({ type: MovieDataDto })
  @Expose()
  data: MovieDataDto

  @ApiPropertyOptional({ type: [MovieStatisticsDto] })
  @Expose()
  @Type(() => MovieStatisticsDto)
  statistics?: MovieStatisticsDto[]
}
