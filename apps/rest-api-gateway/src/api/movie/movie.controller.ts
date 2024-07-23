import { Controller, Get, Query, ValidationPipe } from '@nestjs/common'
import { FindMovieQueryDto } from './dto/find-movie.query.dto'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { FindMovieResponseDto } from './dto/find-movie.response.dto'
import { MovieService } from './movie.service'
import axios from 'axios'

@Controller()
@ApiTags('movies')
@ApiBearerAuth()
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  // @UseGuards(JwtAuthGuard)
  @Get('/movies')
  @ApiOperation({
    summary: '영화 검색',
    description: 'KMDB API를 사용하여 영화를 검색합니다.',
  })
  @ApiOkResponse({ type: FindMovieResponseDto })
  async findMovies(
    @Query(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    )
    query: FindMovieQueryDto,
  ): Promise<FindMovieResponseDto> {
    console.log({ methodName: 'findMovies', data: query, context: 'query' })

    const KMDB_API_KEY = process.env.KMDB_API_KEY
    const KMDB_API_URL = process.env.KMDB_API_URL

    const title = query.title
    // const director = query.director
    // const actor = query.actor
    // const genre = query.genre
    // const company = query.company
    // const releaseDts = query.releaseDts
    // const sort = query.sort // TODO 추가 검색 필요 동작 X
    const listCount = 25

    const detail = 'Y'

    const URL =
      KMDB_API_URL +
      `&ServiceKey=${KMDB_API_KEY}` +
      `${title ? `&title=${title}` : ``}` +
      `${detail ? `&detail=${detail}` : ``}` +
      `${listCount ? `&listCount=${listCount}` : ``}`

    console.log({ methodName: 'findMovies', data: URL, context: 'URL' })

    const existMovieData: any = await axios({
      url: URL,
      method: 'GET',
    })

    console.log(existMovieData.data.Data[0].Result, 'findMovies')

    const results = existMovieData.data.Data[0].Result.map((value) => {
      // 정규식을 사용하여 파일 확장자로 분리하여 첫 번째 파일명을 반환
      const extractFirstFile = (files: string) => {
        const regex = /[^,]+\.(jpg|JPG|png|PNG)/g
        const matches = files.match(regex)
        return matches && matches.length > 0 ? matches[0] : ''
      }

      return {
        // DOCID: value?.DDCID,
        id: `${value?.movieId}-${value?.movieSeq}`,
        data: {
          title: value?.title,
          prodYear: value?.prodYear,
          director: value?.directors[0],
          actors: value?.actors,
          rating: value?.rating,
          genre: value?.genre,
          repRatDate: value?.repRatDate,
          repRlsDate: value?.repRlsDate,
          // ratings: value?.ratings[0],
          // keywords: value?.keywords,
          posters: value?.posters?.toLowerCase()?.split('.jpg')[0] + '.jpg',
          stlls: value?.stlls?.toLowerCase()?.split('.jpg')[0] + '.jpg',
        },
      }
    })

    for (let i = 0; i < results.length; i++) {
      this.movieService.createMovie({ id: results[i].id, data: results[i].data })
    }

    return {
      totalRecords: existMovieData.data.Data[0].Result.length,
      results: results,
    }

    return null
  }
}
