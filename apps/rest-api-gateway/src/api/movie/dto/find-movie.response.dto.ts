import { ApiProperty } from '@nestjs/swagger'
import { MovieDto } from './movie.dto'

export class FindMovieResponseDto {
  @ApiProperty({ example: '100' })
  totalRecords?: number

  @ApiProperty({ type: [MovieDto] })
  results?: MovieDto[]
}
