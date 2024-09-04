import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class FindRevaluationRequestDto {
  @ApiPropertyOptional({ example: '1', description: '유저 ID' })
  @IsOptional()
  @IsString()
  userId: string

  @ApiPropertyOptional({ example: 'F-0000', description: '영화 ID' })
  @IsOptional()
  @IsString()
  movieId: string

  @ApiPropertyOptional({
    example: '2024-01-01 00:00:00',
    description: '재평가에 대한 검색 시작 날짜 (default : 2024-01-01)',
  })
  @IsOptional()
  @IsString()
  startDate?: string

  @ApiPropertyOptional({
    example: '2024-01-01 00:00:00',
    description: '재평가에 대한 검색 종료 날짜 (default : 2099-01-01)',
  })
  @IsOptional()
  @IsString()
  endDate?: string

  @ApiPropertyOptional({ example: '25', description: 'Page nation' })
  @IsOptional()
  @IsString()
  limit: string

  @ApiPropertyOptional({ example: '1', description: 'Page nation' })
  @IsOptional()
  @IsString()
  page: string

  requestUserId?: string
}
