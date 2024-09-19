import { ApiProperty } from '@nestjs/swagger'
import { RevaluationDto } from './revaluation.dto'

export class FindRevaluationResponseDto {
  @ApiProperty({ example: '25' })
  totalRecords?: number

  @ApiProperty({ type: [RevaluationDto] })
  results?: RevaluationDto[]

  @ApiProperty({ example: '1' })
  totalPages?: number

  @ApiProperty({ example: '1' })
  page?: number

  @ApiProperty({ example: '25' })
  limit?: number
}
