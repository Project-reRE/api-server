import { ApiProperty } from '@nestjs/swagger'

export class MovieDataDto {
  @ApiProperty({ example: '범죄도시4' })
  title?: string

  @ApiProperty({ example: '대한민국' })
  nation?: string

  @ApiProperty({ example: '주식회사 빅펀치픽쳐스,㈜홍필름,㈜비에이엔터테인먼트' })
  company?: string

  @ApiProperty({ example: '109' })
  runtime?: string

  @ApiProperty({ example: '15세관람가' })
  rating?: string

  @ApiProperty({ example: '액션,범죄,스릴러,느와르,코메디' })
  genre?: string

  @ApiProperty({ example: '20240219' })
  repRatDate?: string

  @ApiProperty({ example: '20240424' })
  repRlsDate?: string

  @ApiProperty({
    example: 'http://file.koreafilm.or.kr/thm/02/99/18/37/tn_DPK021861.jpg',
  })
  posters?: string

  @ApiProperty({
    example: 'http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840308.jpg',
  })
  stlls?: string
}
