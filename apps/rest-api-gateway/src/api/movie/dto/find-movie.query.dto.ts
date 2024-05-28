import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class FindMovieQueryDto {
  @ApiPropertyOptional({ example: '범죄도시', description: '영화명' })
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional({ example: '봉준호', description: '감독명' })
  @IsOptional()
  @IsString()
  director?: string

  @ApiPropertyOptional({ example: '마동석', description: '배우' })
  @IsOptional()
  @IsString()
  actor?: string

  @ApiPropertyOptional({ example: '공포', description: '장르명' })
  @IsOptional()
  @IsString()
  genre?: string

  @ApiPropertyOptional({ example: '리리컴퍼니', description: '제작사명' })
  @IsOptional()
  @IsString()
  company?: string

  @ApiPropertyOptional({ example: '20240101', description: '개봉시작일 YYYYMMDD' })
  @IsOptional()
  @IsString()
  releaseDts?: string

  @ApiPropertyOptional({
    example: 'RANK',
    description:
      'RANK 정확도순 정렬\n' +
      'title 영화명 정렬\n' +
      'director 감독명 정렬\n' +
      'company 제작사명 정렬\n' +
      'prodYear 제작년도 정렬',
  })
  @IsOptional()
  @IsString()
  sort?: string

  @ApiPropertyOptional({
    example: 'Y',
    description: '영화 상세 정보(Y,N)',
  })
  @IsOptional()
  @IsString()
  detail?: string

  @ApiPropertyOptional({
    example: 500,
    description: '검색할 LIST COUNT(1~500) *defaultValue : 1',
  })
  @IsOptional()
  listCount?: number
}
