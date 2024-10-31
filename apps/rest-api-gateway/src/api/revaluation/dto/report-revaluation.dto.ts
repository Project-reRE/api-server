import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'

export class ReportRevaluationDto {
  @ApiProperty({
    description: `
    1: '욕설 및 부적절한 표현',
    2: '저작권 침해',
    3: '타인의 명예 훼손',
    4: '성적인 내용',`,
    enum: [1, 2, 3, 4],
  })
  @IsEnum([1, 2, 3, 4])
  reason: [1, 2, 3, 4]
}
