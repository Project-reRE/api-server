import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class FindMovieQueryDto {
  @ApiPropertyOptional({ example: '범죄도시', description: '영화명' })
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional({
    example: 25,
  })
  @IsString()
  @IsOptional()
  limit?: number
}
