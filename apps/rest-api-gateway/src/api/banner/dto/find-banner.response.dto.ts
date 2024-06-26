import { ApiProperty } from '@nestjs/swagger'
import { BannerDto } from './banner.dto'

export class FindBannerResponseDto {
  @ApiProperty({ example: '5' })
  totalRecords?: number

  @ApiProperty({ type: [BannerDto] })
  results?: BannerDto[]
}
