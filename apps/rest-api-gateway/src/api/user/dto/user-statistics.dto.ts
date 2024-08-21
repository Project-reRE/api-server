import { ApiProperty } from '@nestjs/swagger'

export class UserStatisticsDto {
  @ApiProperty({ example: '1' })
  id: string

  @ApiProperty({ example: 48 })
  numRevaluations: number
}
