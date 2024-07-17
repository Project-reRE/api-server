import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class CreateMovieRequestDto {
  @ApiPropertyOptional({ example: 'F-0000', description: 'MOVIE ID + MOVIE SEQ' })
  @IsOptional()
  @IsString()
  id: string

  @ApiPropertyOptional({ example: {}, description: '영화 API 조회 데이터' })
  @IsOptional()
  @IsString()
  data: any
}
