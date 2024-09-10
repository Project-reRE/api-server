import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class FindOneMovieQueryDto {
  @ApiPropertyOptional({ example: '2024-09', description: '상세 검색' })
  @IsOptional()
  @IsString()
  currentDate: string
}
