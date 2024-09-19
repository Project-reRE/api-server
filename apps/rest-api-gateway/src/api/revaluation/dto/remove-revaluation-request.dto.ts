import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class RemoveRevaluationRequestDto {
  @ApiProperty({ example: '1', description: 'revaluationId' })
  @IsNotEmpty()
  @IsString()
  revaluationId: string

  requestUserId: string
}
