import { ApiProperty } from '@nestjs/swagger'
import { MovieSetDto } from './movie-set.dto'

export class FindMovieSetResponseDto {
  @ApiProperty({ example: '100' })
  totalRecords?: number

  @ApiProperty({ type: [MovieSetDto] })
  results?: MovieSetDto[]
}
