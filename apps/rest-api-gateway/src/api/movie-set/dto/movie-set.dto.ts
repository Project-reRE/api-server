import { ApiProperty } from '@nestjs/swagger'
import { MovieDto } from '../../movie/dto/movie.dto'

export class MovieSetDto {
  @ApiProperty({ example: '마동석이 나온 영화' })
  title: string

  @ApiProperty({ example: 'scroll_view' })
  template: string

  @ApiProperty({ example: 0 })
  displayOrder: number

  @ApiProperty({ example: 'most_revaluation' })
  condition: string

  @ApiProperty({ type: [MovieDto] })
  data: MovieDto[]
}
