import { Controller, Get, Query, ValidationPipe } from '@nestjs/common'
import { FindMovieQueryDto } from './dto/find-movie.query.dto'
import axios from 'axios'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { FindMovieResponseDto } from './dto/find-movie.response.dto'
import { MovieDto } from './dto/movie.dto'

@Controller()
@ApiTags('movies')
export class MovieController {
  constructor() {}

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

    const KDMB_API_KEY = process.env.KDMB_API_KEY
    const KMDB_API_URL = process.env.KDMB_API_URL

    const title = query.title
    const director = query.director
    const actor = query.actor
    const genre = query.genre
    const company = query.company
    const releaseDts = query.releaseDts
    const sort = query.sort // TODO 추가 검색 필요 동작 X
    const listCount = query.listCount ?? 1

    const detail = query.detail

    const URL =
      KMDB_API_URL +
      `&ServiceKey=${KDMB_API_KEY}` +
      `${title ? `&title=${title}` : ``}` +
      `${director ? `&director=${director}` : ``}` +
      `${actor ? `&actor=${actor}` : ``}` +
      `${genre ? `&genre=${genre}` : ``}` +
      `${company ? `&company=${company}` : ``}` +
      `${releaseDts ? `&releaseDts=${releaseDts}` : ``}` +
      `${sort ? `&sort=${sort}` : ``}` +
      `${detail ? `&detail=${detail}` : ``}` +
      `${listCount ? `&listCount=${listCount}` : ``}`

    console.log({ methodName: 'findMovies', data: URL, context: 'URL' })

    const existMovieData: any = await axios({
      url: URL,
      method: 'GET',
    })

    const results: MovieDto[] = existMovieData.data.Data[0].Result.map((value) => {
      return {
        DOCID: value?.DDCID,
        movieId: value?.movieId,
        movieSeq: value?.movieSeq,
        title: value?.title,
        prodYear: value?.prodYear,
        directors: value?.directors,
        actors: value?.actors,
        nation: value?.nation,
        company: value?.company,
        runtime: value?.runtime,
        rating: value?.rating,
        genre: value?.genre,
        repRatDate: value?.repRatDate,
        repRlsDate: value?.repRlsDate,
        ratings: value?.ratings,
        keywords: value?.keywords,
        posters: value?.posters,
        stlls: value?.stlls,
      }
    })

    return {
      totalRecords: existMovieData.data.Data[0].Result.length,
      results: results,
    }
  }
}
