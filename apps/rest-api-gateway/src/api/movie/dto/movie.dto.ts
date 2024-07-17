import { ApiProperty } from '@nestjs/swagger'
import { MovieDataDto } from './movie-data.dto'

export class MovieDto {
  @ApiProperty({ example: 'F-0000' })
  id: string

  @ApiProperty({ type: MovieDataDto })
  data: MovieDataDto
}
