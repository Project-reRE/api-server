import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { MovieDataDto } from './movie-data.dto'
import { MovieStatisticsDto } from './movie-statistics.dto'

export class MovieDto {
  @ApiProperty({ example: 'F-0000' })
  id: string

  @ApiProperty({ type: MovieDataDto })
  data: MovieDataDto

  @ApiPropertyOptional({ type: MovieStatisticsDto })
  statistics?: MovieStatisticsDto
}
