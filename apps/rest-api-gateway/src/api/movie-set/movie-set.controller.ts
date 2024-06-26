import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { FindMovieSetResponseDto } from './dto/find-movie-set.response.dto'
import { MovieSetDto } from './dto/movie-set.dto'

@Controller()
@ApiTags('movie-sets')
export class MovieSetController {
  constructor() {}

  @Get('/open-movie-sets')
  @ApiOperation({
    summary: '랭킹 Movie Sets',
    description: '랭킹 Movie Sets',
  })
  @ApiOkResponse({ type: FindMovieSetResponseDto })
  async findOpenMovieSets(): Promise<FindMovieSetResponseDto> {
    console.log({ methodName: 'findOpenMovieSets', data: '', context: 'request' })
    // home service 개발 완료 전 까지 Dummy Data return
    const dummyResponse: MovieSetDto[] = [
      {
        title: '마동석이 나온 영화',
        template: 'scroll_view',
        displayOrder: 0,
        condition: 'most_revaluation',
        data: [
          {
            DOCID: '범죄도시',
            movieId: 'K',
            movieSeq: '35965',
            title: '범죄도시4',
            prodYear: '2024',
            directors: {
              director: [
                {
                  directorNm: '허명행',
                  directorEnNm: 'Heo Myeong-haeng',
                  directorId: '00013080',
                },
              ],
            },
            actors: {
              actor: [
                {
                  actorNm: ' !HS 마동석 !HE ',
                  actorEnNm: 'Don Lee',
                  actorId: '00044619',
                },
              ],
            },
            nation: '대한민국',
            company: '주식회사 빅펀치픽쳐스,㈜홍필름,㈜비에이엔터테인먼트',
            runtime: '109',
            rating: '15세관람가',
            genre: '액션,범죄,스릴러,느와르,코메디',
            repRatDate: '20240219',
            repRlsDate: '20240424',
            posters:
              'http://file.koreafilm.or.kr/thm/02/99/18/37/tn_DPK021861.jpg|http://file.koreafilm.or.kr/thm/02/99/18/31/tn_DPK021645.jpg|http://file.koreafilm.or.kr/thm/02/99/18/35/tn_DPK021798.jpg|http://file.koreafilm.or.kr/thm/02/99/18/37/tn_DPK021850.jpg|http://file.koreafilm.or.kr/thm/02/99/18/35/tn_DPK021799.jpg|http://file.koreafilm.or.kr/thm/02/99/18/37/tn_DPK021852.jpg|http://file.koreafilm.or.kr/thm/02/99/18/37/tn_DPK021853.jpg|http://file.koreafilm.or.kr/thm/02/99/18/39/tn_DPK021908.jpg|ht',
            stlls:
              'http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840308.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840309.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840310.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840311.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840312.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840313.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840314.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840315.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840316.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840317.jpg',
          },
          {
            DOCID: '범죄도시',
            movieId: 'K',
            movieSeq: '35965',
            title: '범죄도시4',
            prodYear: '2024',
            directors: {
              director: [
                {
                  directorNm: '허명행',
                  directorEnNm: 'Heo Myeong-haeng',
                  directorId: '00013080',
                },
              ],
            },
            actors: {
              actor: [
                {
                  actorNm: ' !HS 마동석 !HE ',
                  actorEnNm: 'Don Lee',
                  actorId: '00044619',
                },
              ],
            },
            nation: '대한민국',
            company: '주식회사 빅펀치픽쳐스,㈜홍필름,㈜비에이엔터테인먼트',
            runtime: '109',
            rating: '15세관람가',
            genre: '액션,범죄,스릴러,느와르,코메디',
            repRatDate: '20240219',
            repRlsDate: '20240424',
            posters:
              'http://file.koreafilm.or.kr/thm/02/99/18/37/tn_DPK021861.jpg|http://file.koreafilm.or.kr/thm/02/99/18/31/tn_DPK021645.jpg|http://file.koreafilm.or.kr/thm/02/99/18/35/tn_DPK021798.jpg|http://file.koreafilm.or.kr/thm/02/99/18/37/tn_DPK021850.jpg|http://file.koreafilm.or.kr/thm/02/99/18/35/tn_DPK021799.jpg|http://file.koreafilm.or.kr/thm/02/99/18/37/tn_DPK021852.jpg|http://file.koreafilm.or.kr/thm/02/99/18/37/tn_DPK021853.jpg|http://file.koreafilm.or.kr/thm/02/99/18/39/tn_DPK021908.jpg|ht',
            stlls:
              'http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840308.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840309.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840310.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840311.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840312.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840313.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840314.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840315.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840316.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840317.jpg',
          },
          {
            DOCID: '범죄도시',
            movieId: 'K',
            movieSeq: '35965',
            title: '범죄도시4',
            prodYear: '2024',
            directors: {
              director: [
                {
                  directorNm: '허명행',
                  directorEnNm: 'Heo Myeong-haeng',
                  directorId: '00013080',
                },
              ],
            },
            actors: {
              actor: [
                {
                  actorNm: ' !HS 마동석 !HE ',
                  actorEnNm: 'Don Lee',
                  actorId: '00044619',
                },
              ],
            },
            nation: '대한민국',
            company: '주식회사 빅펀치픽쳐스,㈜홍필름,㈜비에이엔터테인먼트',
            runtime: '109',
            rating: '15세관람가',
            genre: '액션,범죄,스릴러,느와르,코메디',
            repRatDate: '20240219',
            repRlsDate: '20240424',
            posters:
              'http://file.koreafilm.or.kr/thm/02/99/18/37/tn_DPK021861.jpg|http://file.koreafilm.or.kr/thm/02/99/18/31/tn_DPK021645.jpg|http://file.koreafilm.or.kr/thm/02/99/18/35/tn_DPK021798.jpg|http://file.koreafilm.or.kr/thm/02/99/18/37/tn_DPK021850.jpg|http://file.koreafilm.or.kr/thm/02/99/18/35/tn_DPK021799.jpg|http://file.koreafilm.or.kr/thm/02/99/18/37/tn_DPK021852.jpg|http://file.koreafilm.or.kr/thm/02/99/18/37/tn_DPK021853.jpg|http://file.koreafilm.or.kr/thm/02/99/18/39/tn_DPK021908.jpg|ht',
            stlls:
              'http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840308.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840309.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840310.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840311.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840312.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840313.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840314.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840315.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840316.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840317.jpg',
          },
        ],
      },
      {
        title: '범죄도시 스릴러',
        template: 'scroll_view',
        displayOrder: 1,
        condition: 'highest_numStars',
        data: [
          {
            DOCID: '범죄도시',
            movieId: 'K',
            movieSeq: '35965',
            title: '범죄도시4',
            prodYear: '2024',
            directors: {
              director: [
                {
                  directorNm: '허명행',
                  directorEnNm: 'Heo Myeong-haeng',
                  directorId: '00013080',
                },
              ],
            },
            actors: {
              actor: [
                {
                  actorNm: ' !HS 마동석 !HE ',
                  actorEnNm: 'Don Lee',
                  actorId: '00044619',
                },
              ],
            },
            nation: '대한민국',
            company: '주식회사 빅펀치픽쳐스,㈜홍필름,㈜비에이엔터테인먼트',
            runtime: '109',
            rating: '15세관람가',
            genre: '액션,범죄,스릴러,느와르,코메디',
            repRatDate: '20240219',
            repRlsDate: '20240424',
            posters:
              'http://file.koreafilm.or.kr/thm/02/99/18/37/tn_DPK021861.jpg|http://file.koreafilm.or.kr/thm/02/99/18/31/tn_DPK021645.jpg|http://file.koreafilm.or.kr/thm/02/99/18/35/tn_DPK021798.jpg|http://file.koreafilm.or.kr/thm/02/99/18/37/tn_DPK021850.jpg|http://file.koreafilm.or.kr/thm/02/99/18/35/tn_DPK021799.jpg|http://file.koreafilm.or.kr/thm/02/99/18/37/tn_DPK021852.jpg|http://file.koreafilm.or.kr/thm/02/99/18/37/tn_DPK021853.jpg|http://file.koreafilm.or.kr/thm/02/99/18/39/tn_DPK021908.jpg|ht',
            stlls:
              'http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840308.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840309.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840310.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840311.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840312.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840313.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840314.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840315.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840316.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840317.jpg',
          },
          {
            DOCID: '범죄도시',
            movieId: 'K',
            movieSeq: '35965',
            title: '범죄도시4',
            prodYear: '2024',
            directors: {
              director: [
                {
                  directorNm: '허명행',
                  directorEnNm: 'Heo Myeong-haeng',
                  directorId: '00013080',
                },
              ],
            },
            actors: {
              actor: [
                {
                  actorNm: ' !HS 마동석 !HE ',
                  actorEnNm: 'Don Lee',
                  actorId: '00044619',
                },
              ],
            },
            nation: '대한민국',
            company: '주식회사 빅펀치픽쳐스,㈜홍필름,㈜비에이엔터테인먼트',
            runtime: '109',
            rating: '15세관람가',
            genre: '액션,범죄,스릴러,느와르,코메디',
            repRatDate: '20240219',
            repRlsDate: '20240424',
            posters:
              'http://file.koreafilm.or.kr/thm/02/99/18/37/tn_DPK021861.jpg|http://file.koreafilm.or.kr/thm/02/99/18/31/tn_DPK021645.jpg|http://file.koreafilm.or.kr/thm/02/99/18/35/tn_DPK021798.jpg|http://file.koreafilm.or.kr/thm/02/99/18/37/tn_DPK021850.jpg|http://file.koreafilm.or.kr/thm/02/99/18/35/tn_DPK021799.jpg|http://file.koreafilm.or.kr/thm/02/99/18/37/tn_DPK021852.jpg|http://file.koreafilm.or.kr/thm/02/99/18/37/tn_DPK021853.jpg|http://file.koreafilm.or.kr/thm/02/99/18/39/tn_DPK021908.jpg|ht',
            stlls:
              'http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840308.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840309.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840310.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840311.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840312.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840313.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840314.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840315.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840316.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840317.jpg',
          },
          {
            DOCID: '범죄도시',
            movieId: 'K',
            movieSeq: '35965',
            title: '범죄도시4',
            prodYear: '2024',
            directors: {
              director: [
                {
                  directorNm: '허명행',
                  directorEnNm: 'Heo Myeong-haeng',
                  directorId: '00013080',
                },
              ],
            },
            actors: {
              actor: [
                {
                  actorNm: ' !HS 마동석 !HE ',
                  actorEnNm: 'Don Lee',
                  actorId: '00044619',
                },
              ],
            },
            nation: '대한민국',
            company: '주식회사 빅펀치픽쳐스,㈜홍필름,㈜비에이엔터테인먼트',
            runtime: '109',
            rating: '15세관람가',
            genre: '액션,범죄,스릴러,느와르,코메디',
            repRatDate: '20240219',
            repRlsDate: '20240424',
            posters:
              'http://file.koreafilm.or.kr/thm/02/99/18/37/tn_DPK021861.jpg|http://file.koreafilm.or.kr/thm/02/99/18/31/tn_DPK021645.jpg|http://file.koreafilm.or.kr/thm/02/99/18/35/tn_DPK021798.jpg|http://file.koreafilm.or.kr/thm/02/99/18/37/tn_DPK021850.jpg|http://file.koreafilm.or.kr/thm/02/99/18/35/tn_DPK021799.jpg|http://file.koreafilm.or.kr/thm/02/99/18/37/tn_DPK021852.jpg|http://file.koreafilm.or.kr/thm/02/99/18/37/tn_DPK021853.jpg|http://file.koreafilm.or.kr/thm/02/99/18/39/tn_DPK021908.jpg|ht',
            stlls:
              'http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840308.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840309.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840310.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840311.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840312.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840313.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840314.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840315.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840316.jpg|http://file.koreafilm.or.kr/thm/01/copy/00/66/74/tn_DST840317.jpg',
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
