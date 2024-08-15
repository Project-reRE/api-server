import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { FindOpenBannerResponseDto } from './dto/find-open-banner.response.dto'

@Controller()
@ApiTags('banners')
export class BannerController {
  constructor() {}

  @Get('/open-banners')
  @ApiOperation({
    summary: 'MOVIE Banner',
    description: 'MOVIE Banner',
  })
  @ApiOkResponse({ type: FindOpenBannerResponseDto })
  async findOpenBanner(): Promise<FindOpenBannerResponseDto> {
    console.log({ methodName: 'findOpenBanner', data: '', context: 'request' })
    // home service 개발 완료 전 까지 Dummy Data return
    const dummyResponse = [
      {
        route: 'http://rerevaludation.com/movie',
        displayOrder: 0,
        imageUrl: 'http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840308.jpg',
      },
      {
        route: 'http://rerevaludation.com/movie',
        displayOrder: 1,
        imageUrl: 'http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840308.jpg',
      },
      {
        route: 'http://rerevaludation.com/movie',
        displayOrder: 2,
        imageUrl: 'http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840316.jpg',
      },
    ]
    return {
      totalRecords: dummyResponse.length,
      results: dummyResponse,
    }
  }
}
