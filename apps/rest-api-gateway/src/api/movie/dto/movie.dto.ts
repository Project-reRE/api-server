import { ApiProperty } from '@nestjs/swagger'

export class MovieDto {
  @ApiProperty({ example: '범죄도시' })
  DOCID?: string

  @ApiProperty({ example: 'K' })
  movieId?: string

  @ApiProperty({ example: '35965' })
  movieSeq?: string

  @ApiProperty({ example: '범죄도시4' })
  title?: string

  @ApiProperty({ example: '2024' })
  prodYear?: string

  @ApiProperty({
    example: {
      director: [
        {
          directorNm: '허명행',
          directorEnNm: 'Heo Myeong-haeng',
          directorId: '00013080',
        },
      ],
    },
  })
  directors?: object

  @ApiProperty({
    example: {
      actor: [
        {
          actorNm: ' !HS 마동석 !HE ',
          actorEnNm: 'Don Lee',
          actorId: '00044619',
        },
      ],
    },
  })
  actors?: object

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
    example:
      'http://file.koreafilm.or.kr/thm/02/99/18/37/tn_DPK021861.jpg|http://file.koreafilm.or.kr/thm/02/99/18/31/tn_DPK021645.jpg|http://file.koreafilm.or.kr/thm/02/99/18/35/tn_DPK021798.jpg|http://file.koreafilm.or.kr/thm/02/99/18/37/tn_DPK021850.jpg|http://file.koreafilm.or.kr/thm/02/99/18/35/tn_DPK021799.jpg|http://file.koreafilm.or.kr/thm/02/99/18/37/tn_DPK021852.jpg|http://file.koreafilm.or.kr/thm/02/99/18/37/tn_DPK021853.jpg|http://file.koreafilm.or.kr/thm/02/99/18/39/tn_DPK021908.jpg|ht',
  })
  posters?: string

  @ApiProperty({
    example:
      'http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840308.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840309.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840310.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840311.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840312.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840313.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840314.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840315.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840316.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840317.jpg',
  })
  stlls?: string
}
