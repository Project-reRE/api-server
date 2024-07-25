import { ApiProperty } from '@nestjs/swagger'

export class RevaluationDto {
  @ApiProperty({ example: 'F-0000' })
  id: string
}
