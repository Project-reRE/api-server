import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { FindBannerResponseDto } from './dto/find-banner.response.dto'

@Controller()
@ApiTags('banners')
export class BannerController {
  constructor() {}

  @Get('/open-banners')
  @ApiOperation({
    summary: 'MOVIE Banner',
    description: 'MOVIE Banner',
  })
  @ApiOkResponse({ type: FindBannerResponseDto })
  async findOpenBanner(): Promise<FindBannerResponseDto> {
    console.log({ methodName: 'findOpenBanner', data: '', context: 'request' })
    // home service 개발 완료 전 까지 Dummy Data return
    const dummyResponse = [
      {
        title: '화제의 스릴러',
        body: '마동석의 범죄자 체포 스틸컷',
        template: 'scroll_view',
        route: 'http://rerevaludation.com/movie',
        boxHexCode: '#040201',
        displayOrder: 0,
        imageUrl: 'http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840308.jpg',
        display: true,
      },
      {
        title: '경찰 영화 추천',
        body: '장첸과의 전투 스틸컷',
        template: 'scroll_view',
        route: 'http://rerevaludation.com/movie',
        boxHexCode: '#040201',
        displayOrder: 1,
        imageUrl: 'http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840308.jpg',
        display: true,
      },
      {
        title: '마동석 시리즈',
        body: '너 RERE로 납치된거야',
        template: 'scroll_view',
        route: 'http://rerevaludation.com/movie',
        boxHexCode: '#040201',
        displayOrder: 2,
        imageUrl: 'http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840316.jpg',
        display: true,
      },
    ]
    return {
      totalRecords: dummyResponse.length,
      results: dummyResponse,
    }
  }
}
