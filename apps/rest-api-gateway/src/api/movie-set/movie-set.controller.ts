import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { FindMovieSetResponseDto } from './dto/find-movie-set.response.dto'
import { MovieSetDto } from './dto/movie-set.dto'
import { MovieSetService } from './movie-set.service'

@Controller()
@ApiTags('movie-sets')
export class MovieSetController {
  constructor(private readonly movieSetService: MovieSetService) {}

  @Get('/open-movie-sets')
  @ApiOperation({
    summary: '랭킹 Movie Sets',
    description: '랭킹 Movie Sets',
  })
  @ApiOkResponse({ type: FindMovieSetResponseDto })
  async findOpenMovieSets(): Promise<FindMovieSetResponseDto> {
    // console.log({ methodName: 'findOpenMovieSets', data: '', context: 'request' })
    // home service 개발 완료 전 까지 Dummy Data return

    const dummyResponse: MovieSetDto[] = [
      {
        title: '가장 많은 재평가를 받은 영화 Top3',
        genre: '액션',
        template: 'scroll_view',
        displayOrder: 0,
        condition: 'most_revaluation',
        data: [
          {
            id: 'F-0000',
            data: {
              title: '범죄도시4',
              genre: ['액션,범죄,스릴러,느와르,코메디'],
              repRlsDate: '20240424',
              prodYear: 2024,
              directors: [
                {
                  directorNm: '류승완',
                  directorEnNm: 'Ryoo Seung-wan',
                  directorId: '00004003',
                },
              ],
              actors: [
                {
                  actorNm: '황정민',
                  actorEnNm: 'Hwang Jung-min',
                  actorId: '00007364',
                },
                {
                  actorNm: '정우성',
                  actorEnNm: 'Hwang Jung-min',
                  actorId: '00007364',
                },
              ],
              posters: ['http://file.koreafilm.or.kr/thm/02/99/18/37/tn_DPK021861.jpg'],
              stills: ['http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840308.jpg'],
            },
          },
          {
            id: 'F-0000',
            data: {
              title: '범죄도시4',
              genre: ['액션,범죄,스릴러,느와르,코메디'],
              repRlsDate: '20240424',
              prodYear: 2024,
              directors: [
                {
                  directorNm: '류승완',
                  directorEnNm: 'Ryoo Seung-wan',
                  directorId: '00004003',
                },
              ],
              actors: [
                {
                  actorNm: '황정민',
                  actorEnNm: 'Hwang Jung-min',
                  actorId: '00007364',
                },
                {
                  actorNm: '정우성',
                  actorEnNm: 'Hwang Jung-min',
                  actorId: '00007364',
                },
              ],
              posters: ['http://file.koreafilm.or.kr/thm/02/99/18/37/tn_DPK021861.jpg'],
              stills: ['http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840308.jpg'],
            },
          },
          {
            id: 'F-0000',
            data: {
              title: '범죄도시4',
              genre: ['액션,범죄,스릴러,느와르,코메디'],
              repRlsDate: '20240424',
              prodYear: 2024,
              directors: [
                {
                  directorNm: '류승완',
                  directorEnNm: 'Ryoo Seung-wan',
                  directorId: '00004003',
                },
              ],
              actors: [
                {
                  actorNm: '황정민',
                  actorEnNm: 'Hwang Jung-min',
                  actorId: '00007364',
                },
                {
                  actorNm: '정우성',
                  actorEnNm: 'Hwang Jung-min',
                  actorId: '00007364',
                },
              ],
              posters: ['http://file.koreafilm.or.kr/thm/02/99/18/37/tn_DPK021861.jpg'],
              stills: ['http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840308.jpg'],
            },
          },
        ],
      },
      {
        title: '가장 많은 재평가를 받은 영화 Top3',
        template: 'scroll_view',
        genre: '느와르',
        displayOrder: 0,
        condition: 'most_revaluation',
        data: [
          {
            id: 'F-0000',
            data: {
              title: '범죄도시4',
              genre: ['액션,범죄,스릴러,느와르,코메디'],
              repRlsDate: '20240424',
              prodYear: 2024,
              directors: [
                {
                  directorNm: '류승완',
                  directorEnNm: 'Ryoo Seung-wan',
                  directorId: '00004003',
                },
              ],
              actors: [
                {
                  actorNm: '황정민',
                  actorEnNm: 'Hwang Jung-min',
                  actorId: '00007364',
                },
                {
                  actorNm: '정우성',
                  actorEnNm: 'Hwang Jung-min',
                  actorId: '00007364',
                },
              ],
              posters: ['http://file.koreafilm.or.kr/thm/02/99/18/37/tn_DPK021861.jpg'],
              stills: ['http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840308.jpg'],
            },
          },
          {
            id: 'F-0000',
            data: {
              title: '범죄도시4',
              genre: ['액션,범죄,스릴러,느와르,코메디'],
              repRlsDate: '20240424',
              prodYear: 2024,
              directors: [
                {
                  directorNm: '류승완',
                  directorEnNm: 'Ryoo Seung-wan',
                  directorId: '00004003',
                },
              ],
              actors: [
                {
                  actorNm: '황정민',
                  actorEnNm: 'Hwang Jung-min',
                  actorId: '00007364',
                },
                {
                  actorNm: '정우성',
                  actorEnNm: 'Hwang Jung-min',
                  actorId: '00007364',
                },
              ],
              posters: ['http://file.koreafilm.or.kr/thm/02/99/18/37/tn_DPK021861.jpg'],
              stills: ['http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840308.jpg'],
            },
          },
          {
            id: 'F-0000',
            data: {
              title: '범죄도시4',
              genre: ['액션,범죄,스릴러,느와르,코메디'],
              repRlsDate: '20240424',
              prodYear: 2024,
              directors: [
                {
                  directorNm: '류승완',
                  directorEnNm: 'Ryoo Seung-wan',
                  directorId: '00004003',
                },
              ],
              actors: [
                {
                  actorNm: '황정민',
                  actorEnNm: 'Hwang Jung-min',
                  actorId: '00007364',
                },
                {
                  actorNm: '정우성',
                  actorEnNm: 'Hwang Jung-min',
                  actorId: '00007364',
                },
              ],
              posters: ['http://file.koreafilm.or.kr/thm/02/99/18/37/tn_DPK021861.jpg'],
              stills: ['http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840308.jpg'],
            },
          },
        ],
      },
      {
        title: "가장 많은 재평가를 받은 영화 Top3',",
        genre: '로맨스',
        template: 'scroll_view',
        displayOrder: 0,
        condition: 'most_revaluation',
        data: [
          {
            id: 'F-0000',
            data: {
              title: '범죄도시4',
              genre: ['액션,범죄,스릴러,느와르,코메디'],
              repRlsDate: '20240424',
              prodYear: 2024,
              directors: [
                {
                  directorNm: '류승완',
                  directorEnNm: 'Ryoo Seung-wan',
                  directorId: '00004003',
                },
              ],
              actors: [
                {
                  actorNm: '황정민',
                  actorEnNm: 'Hwang Jung-min',
                  actorId: '00007364',
                },
                {
                  actorNm: '정우성',
                  actorEnNm: 'Hwang Jung-min',
                  actorId: '00007364',
                },
              ],
              posters: ['http://file.koreafilm.or.kr/thm/02/99/18/37/tn_DPK021861.jpg'],
              stills: ['http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840308.jpg'],
            },
          },
          {
            id: 'F-0000',
            data: {
              title: '범죄도시4',
              genre: ['액션,범죄,스릴러,느와르,코메디'],
              repRlsDate: '20240424',
              prodYear: 2024,
              directors: [
                {
                  directorNm: '류승완',
                  directorEnNm: 'Ryoo Seung-wan',
                  directorId: '00004003',
                },
              ],
              actors: [
                {
                  actorNm: '황정민',
                  actorEnNm: 'Hwang Jung-min',
                  actorId: '00007364',
                },
                {
                  actorNm: '정우성',
                  actorEnNm: 'Hwang Jung-min',
                  actorId: '00007364',
                },
              ],
              posters: ['http://file.koreafilm.or.kr/thm/02/99/18/37/tn_DPK021861.jpg'],
              stills: ['http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840308.jpg'],
            },
          },
          {
            id: 'F-0000',
            data: {
              title: '범죄도시4',
              genre: ['액션,범죄,스릴러,느와르,코메디'],
              repRlsDate: '20240424',
              prodYear: 2024,
              directors: [
                {
                  directorNm: '류승완',
                  directorEnNm: 'Ryoo Seung-wan',
                  directorId: '00004003',
                },
              ],
              actors: [
                {
                  actorNm: '황정민',
                  actorEnNm: 'Hwang Jung-min',
                  actorId: '00007364',
                },
                {
                  actorNm: '정우성',
                  actorEnNm: 'Hwang Jung-min',
                  actorId: '00007364',
                },
              ],
              posters: ['http://file.koreafilm.or.kr/thm/02/99/18/37/tn_DPK021861.jpg'],
              stills: ['http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840308.jpg'],
            },
          },
        ],
      },
    ]
    return {
      totalRecords: dummyResponse.length,
      results: dummyResponse,
    }
  }
}
