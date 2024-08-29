import { ApiProperty } from '@nestjs/swagger'

export class CreateRevaluationResponseDto {
  @ApiProperty({ example: '1' })
  id: string
}
