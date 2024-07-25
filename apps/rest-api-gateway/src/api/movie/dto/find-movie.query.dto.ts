import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class FindMovieQueryDto {
  @ApiPropertyOptional({ example: '범죄도시', description: '영화명' })
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional({ example: 25 })
  @IsOptional()
  @IsNumber()
  limit?: number
}
