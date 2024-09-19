import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { QueryParamsDto } from '../../../../../../libs/query/query-params.dto'

export class FindMyRevaluationRequestDto extends QueryParamsDto {
  userId: string

  @ApiPropertyOptional({ example: 'F-0000', description: '영화 ID' })
  @IsOptional()
  @IsString()
  movieId: string

  @ApiPropertyOptional({ example: '2024-01-01 00:00:00', description: '검색 시작 날짜 (default : 2024-01-01)' })
  @IsOptional()
  @IsString()
  startDate?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  endDate?: string
}
