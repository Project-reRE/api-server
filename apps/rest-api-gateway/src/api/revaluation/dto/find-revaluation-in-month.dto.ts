import { ApiProperty } from '@nestjs/swagger'

export class FindRevaluationInMonthDto {
  @ApiProperty({ example: 'f-000000' })
  movieId: string
}
