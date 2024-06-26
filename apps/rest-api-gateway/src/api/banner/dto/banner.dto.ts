import { ApiProperty } from '@nestjs/swagger'

export class BannerDto {
  @ApiProperty({ example: '화제의 스릴러' })
  title: string

  @ApiProperty({ example: '마동석의 범죄자 체포 씬' })
  body: string

  @ApiProperty({ example: 'scroll_view' })
  template: string

  @ApiProperty({ example: 'http://rerevaludation.com/movie' })
  route?: string

  @ApiProperty({ example: '#040201' })
  boxHexCode?: string

  @ApiProperty({ example: 0 })
  displayOrder: number

  @ApiProperty({ example: 'http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840308.jpg' })
  imageUrl?: string

  @ApiProperty({ example: true })
  display: boolean
}
