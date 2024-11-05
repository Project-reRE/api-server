import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { FindOpenBannerResponseDto } from './dto/find-open-banner.response.dto'

@Controller()
@ApiTags('banners')
export class BannerController {
  @Get('/open-banners')
  @ApiOperation({
    summary: 'MOVIE Banner',
    description: 'MOVIE Banner',
  })
  @ApiOkResponse({ type: FindOpenBannerResponseDto })
  async findOpenBanner(): Promise<FindOpenBannerResponseDto> {
    const dummyResponse = [
      {
        route: 'https://reevaluation.notion.site/b458446df3b943749fb5b603f7155448',
        displayOrder: 0,
        imageUrl:
          'https://rere-banner.s3.ap-northeast-2.amazonaws.com/%E1%84%8B%E1%85%A2%E1%86%B8_%E1%84%87%E1%85%A2%E1%84%82%E1%85%A51.png',
      },
      {
        route: 'https://reevaluation.notion.site/cafff7657cd44b4991c7ce27cf39b384',
        displayOrder: 1,
        imageUrl:
          'https://rere-banner.s3.ap-northeast-2.amazonaws.com/%E1%84%8B%E1%85%A2%E1%86%B8_%E1%84%87%E1%85%A2%E1%84%82%E1%85%A52.png',
      },
      {
        route: 'search',
        displayOrder: 2,
        imageUrl:
          'https://rere-banner.s3.ap-northeast-2.amazonaws.com/%E1%84%8B%E1%85%A2%E1%86%B8_%E1%84%87%E1%85%A2%E1%84%82%E1%85%A53.png',
      },
    ]
    return {
      totalRecords: dummyResponse.length,
      results: dummyResponse,
    }
  }
}
