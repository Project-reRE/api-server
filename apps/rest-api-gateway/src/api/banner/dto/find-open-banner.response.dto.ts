import { ApiProperty } from '@nestjs/swagger'
import { OpenBannerDto } from './open-banner.dto'

export class FindOpenBannerResponseDto {
  @ApiProperty({ example: '5' })
  totalRecords?: number

  @ApiProperty({ type: [OpenBannerDto] })
  results?: OpenBannerDto[]
}
