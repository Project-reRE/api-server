import { ApiProperty } from '@nestjs/swagger'
import { RevaluationDto } from './revaluation.dto'

export class FindRevaluationResponseDto {
  @ApiProperty({ example: '25' })
  totalRecords?: number

  @ApiProperty({ type: [RevaluationDto] })
  results?: RevaluationDto[]
}
