import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class MovieDataDto {
  @ApiProperty({ example: '범죄도시4' })
  title?: string

  @ApiPropertyOptional({ example: '액션,범죄,스릴러,느와르,코메디' })
  genre?: string

  @ApiPropertyOptional({ example: '20240424' })
  repRlsDate?: string

  @ApiPropertyOptional({ type: [] })
  director?: string[]

  @ApiPropertyOptional({ type: [] })
  actors?: string[]

  @ApiPropertyOptional({
    type: ['http://file.koreafilm.or.kr/thm/02/99/18/37/tn_DPK021861.jpg'],
  })
  posters?: string
  @ApiPropertyOptional({
    type: ['http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840308.jpg'],
  })
  stlls?: string
}
