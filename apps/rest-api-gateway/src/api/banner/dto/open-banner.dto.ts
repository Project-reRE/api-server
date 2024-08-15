import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class OpenBannerDto {
  @ApiPropertyOptional({ example: 'http://rerevaludation.com/movie' })
  route?: string

  @ApiProperty({ example: 0 })
  displayOrder: number

  @ApiProperty({ example: 'http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840308.jpg' })
  imageUrl?: string
}
