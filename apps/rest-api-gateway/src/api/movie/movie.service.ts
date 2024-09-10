import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { MovieEntity } from '../../entity/movie.entity'
import { FindOneMovieRequestDto } from './dto/find-one-movie-request.dto'
import { FindMovieQueryDto } from './dto/find-movie.query.dto'
import axios from 'axios'
import { FindMovieResponseDto } from './dto/find-movie.response.dto'
import { CreateMovieRequestDto } from './dto/create-movie-request.dto'
import { FindOneMovieResponseDto } from './dto/find-one-movie-response.dto'
import { status as GrpcStatus } from '@grpc/grpc-js'
import * as dayjs from 'dayjs'
import { MovieStatisticsEntity } from '../../entity/movie-statistics.entity'

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(MovieEntity)
    private movieRepository: Repository<MovieEntity>,
    @InjectRepository(MovieStatisticsEntity)
    private movieStatisticsRepository: Repository<MovieStatisticsEntity>,
  ) {}

  async createMovie(request: CreateMovieRequestDto): Promise<void> {
    console.log(request, 'createMovie')

    const existMovie = await this.movieRepository.findOne({
      where: { id: request.id },
      relations: { statistics: true },
    })

    if (!existMovie) {
      const now = dayjs()
      const currentDate = now.format('YYYY-MM')

      // currentDate 기준으로 앞에 5달 statistics 가져오기 + numStars 채워놓기
      const creatableMovie = this.movieRepository.create({ ...request, statistics: [{ currentDate: currentDate }] })

      await this.movieRepository.save(creatableMovie)
    }

    return null
  }

  async findOneMovie(request: FindOneMovieRequestDto): Promise<FindOneMovieResponseDto> {
    console.log(request, 'findOneMovie')

    const existMovie = await this.movieRepository.findOne({
      where: { id: request.id },
    })

    if (!existMovie) {
      throw new HttpException(
        {
          code: 'MOVIE_NOTFOUND',
          status: GrpcStatus.NOT_FOUND,
          message: `존재 하지 않은 영화 정보(id : ${request.id})`,
        },
        HttpStatus.NOT_FOUND,
      )
    }

    let existMovieStatistics = await this.movieStatisticsRepository.findOne({
      where: {
        movie: { id: existMovie.id },
        currentDate: request.currentDate,
      },
    })

    if (!existMovieStatistics) {
      const creatableMovieStatistics = this.movieStatisticsRepository.create({
        movie: { id: existMovie.id },
        currentDate: request.currentDate,
      })

      const previousMonths = await this.getPreviousMonths(request.currentDate)

      const numRecentStars = []

      for (let i = 0; i < previousMonths.length; i++) {
        const existMovieStatistics = await this.movieStatisticsRepository.findOne({
          where: {
            movie: { id: existMovie.id },
            currentDate: previousMonths[i],
          },
        })

        numRecentStars.push({
          numStars: existMovieStatistics?.numStars ?? 0,
          currentDate: previousMonths[i],
        })
      }

      creatableMovieStatistics.numRecentStars = numRecentStars

      existMovieStatistics = await this.movieStatisticsRepository.save(creatableMovieStatistics)
    }

    existMovie.statistics = existMovieStatistics ? [existMovieStatistics] : []

    console.log(existMovie, 'findOneMovie')

    return existMovie
  }

  async findMovies(request: FindMovieQueryDto): Promise<FindMovieResponseDto> {
    console.log({ methodName: 'findMovies', data: request })

    const KMDB_API_KEY = process.env.KMDB_API_KEY
    const KMDB_API_URL = process.env.KMDB_API_URL

    const title = request.title

    const listCount = request.limit ?? 25

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

    const results = existMovieData.data.Data[0].Result?.map((value) => {
      const posters = value?.posters?.toLowerCase()?.split('.jpg')[0]
      const stills = value?.stills?.toLowerCase()?.split('.jpg')[0]

      return {
        // DOCID: value?.DDCID,
        id: `${value?.movieId}-${value?.movieSeq}`,
        data: {
          title: value?.title
            ?.replace(/!HS|!HE/g, '')
            .replace(/\s+/g, ' ')
            .trim(),
          prodYear: value?.prodYear,
          directors: Array.isArray(value?.directors?.director)
            ? value.directors.director.slice(0, 10)
            : value?.directors?.director, // 최대 10명
          actors: Array.isArray(value?.actors?.actor) ? value.actors.actor.slice(0, 10) : value?.actors?.actor, // 최대 10명
          rating: value?.rating,
          genre: value?.genre,
          repRatDate: value?.repRatDate,
          repRlsDate: value?.repRlsDate,
          posters: posters ? [posters + '.jpg'] : [],
          stills: stills ? [stills + '.jpg'] : [],
        },
      }
    })

    for (let i = 0; i < results?.length; i++) {
      await this.createMovie({ id: results[i].id, data: results[i].data })
    }

    return {
      totalRecords: results?.length ?? 0,
      results: results ?? [],
    }
  }

  private async getPreviousMonths(currentDate: string): Promise<string[]> {
    const [year, month] = currentDate.split('-').map(Number)
    const dates: string[] = []

    let date = new Date(year, month - 1) // JavaScript Date는 0부터 11까지로 월을 표현하므로, -1을 해줌

    for (let i = 0; i < 5; i++) {
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0') // 월을 2자리 숫자로 변환
      dates.push(`${year}-${month}`)
      date.setMonth(date.getMonth() - 1) // 한 달 전으로 이동
    }

    return dates
  }
}
