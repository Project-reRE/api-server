import { ApiProperty } from '@nestjs/swagger'

export class RemoveRevaluationResponseDto {
  @ApiProperty({ example: '1' })
  id: string
}
