import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class FindOneMovieRequestDto {
  @ApiProperty({ example: 'F-0000', description: 'MOVIE ID + MOVIE SEQ' })
  @IsNotEmpty()
  @IsString()
  id: string

  @ApiPropertyOptional({ example: '2024-09', description: '상세 검색' })
  @IsOptional()
  @IsString()
  currentDate: string
}
