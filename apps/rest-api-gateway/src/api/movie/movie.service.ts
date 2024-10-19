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
import * as dayjs from 'dayjs'
import { MovieStatisticsEntity } from '../../entity/movie-statistics.entity'

@Injectable()
export class MovieService {
  KMDB_API_KEY = process.env.KMDB_API_KEY
  KMDB_API_URL = process.env.KMDB_API_URL

  constructor(
    @InjectRepository(MovieEntity)
    private movieRepository: Repository<MovieEntity>,
    @InjectRepository(MovieStatisticsEntity)
    private movieStatisticsRepository: Repository<MovieStatisticsEntity>,
  ) {}

  async createMovie(request: CreateMovieRequestDto): Promise<void> {
    // console.log(request, 'createMovie')

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
    // console.log(request, 'findOneMovie')

    const existMovie = await this.movieRepository.findOne({
      where: { id: request.id },
    })

    if (!existMovie) {
      throw new HttpException(
        {
          code: 'MOVIE_NOTFOUND',
          status: HttpStatus.NOT_FOUND,
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
          numStars: existMovieStatistics?.numStars ?? '0',
          currentDate: previousMonths[i],
        })
      }

      creatableMovieStatistics.numRecentStars = numRecentStars

      existMovieStatistics = await this.movieStatisticsRepository.save(creatableMovieStatistics)
    }

    // 최상위 3개의 값을 추출하는 함수
    const getTopThree = (obj: any) => {
      return Object.entries(obj)
        .map(([type, value]) => ({ type, value: parseFloat(value as string) })) // 문자열을 숫자로 변환
        .sort((a, b) => b.value - a.value) // 값(value)을 기준으로 내림차순 정렬
        .slice(0, 3) // 상위 3개 추출
        .map((item, index) => ({
          rank: index + 1,
          type: item.type,
          value: item.value,
        }))
    }

    const getPercentage = (obj: any) => {
      // Step 1: 각 항목을 숫자로 변환
      const items = Object.entries(obj)
        .map(([type, value]) => ({ type, value: parseFloat(value as string) }))
        .sort((a, b) => b.value - a.value) // 값(value)을 기준으로 내림차순 정렬

      // Step 2: 값의 총합을 계산
      const totalValue = items.reduce((sum, item) => sum + item.value, 0)

      // Step 3: 각 값의 비율을 100 기준으로 재조정
      return items.map((item, index) => ({
        rank: index + 1,
        type: item.type,
        value: ((item.value / totalValue) * 100).toFixed(1), // 백분율 계산 후 소수점 첫째자리까지 표현
      }))
    }

    // 사용자에게 노출할 데이터 변환
    const transformedStatistics = {
      ...existMovieStatistics,
      numSpecialPointTopThree: existMovieStatistics.numSpecialPoint
        ? getTopThree(existMovieStatistics.numSpecialPoint)
        : [],
      numPastValuationPercent: existMovieStatistics.numPastValuation
        ? getPercentage(existMovieStatistics.numPastValuation)
        : [],
      numPresentValuationPercent: existMovieStatistics.numPresentValuation
        ? getPercentage(existMovieStatistics.numPresentValuation)
        : [],
      numGenderPercent: existMovieStatistics.numGender ? getPercentage(existMovieStatistics.numGender) : [],
      numAgePercent: existMovieStatistics.numAge ? getPercentage(existMovieStatistics.numAge) : [],
    }

    // 모든 값이 노출되어야 하는 데이터는 그대로 전달
    existMovie.statistics = [transformedStatistics]

    // console.log(existMovie, 'findOneMovie')

    return {
      ...existMovie,
      data: {
        ...existMovie.data,
        genre: existMovie.data.genre === '' ? [] : existMovie.data.genre.split(','),
      },
    }
  }

  async findMovies(request: FindMovieQueryDto): Promise<FindMovieResponseDto> {
    // console.log({ methodName: 'findMovies', data: request })

    const title = request.title

    const listCount = request.limit ?? 25

    const startCount = request.page ? (request.page - 1) * listCount : 0

    const detail = 'Y'

    // 오늘 날짜에서 5년 전 날짜를 YYYYMMDD 형식으로 반환하는 함수
    const getFiveYearsAgo = (): string => {
      const today = new Date()
      const fiveYearsAgo = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate())

      const year = fiveYearsAgo.getFullYear()
      const month = (fiveYearsAgo.getMonth() + 1).toString().padStart(2, '0') // 월을 2자리로 맞춤
      const day = fiveYearsAgo.getDate().toString().padStart(2, '0') // 일을 2자리로 맞춤

      return `${year}${month}${day}`
    }

    // 오늘부터 5년 전의 날짜를 releaseDte에 삽입
    const URL =
      this.KMDB_API_URL +
      `&ServiceKey=${this.KMDB_API_KEY}` +
      `${title ? `&title=${title}` : ``}` +
      `${detail ? `&detail=${detail}` : ``}` +
      `${listCount ? `&listCount=${listCount}` : ``}` +
      `${startCount ? `&startCount=${startCount}` : ``}` +
      `&releaseDte=${getFiveYearsAgo()}`

    const existMovieData: any = await axios({
      url: URL,
      method: 'GET',
    })
    const results = existMovieData.data.Data[0].Result?.map((value) => {
      const posters = value?.posters?.toLowerCase()?.split('.jpg')[0]
      const stills = value?.stills?.toLowerCase()?.split('.jpg')[0]
      const genre = value?.genre === '' ? [] : value?.genre.split(',')

      return {
        // DOCID: value?.DDCID,
        id: `${value?.movieId}-${value?.movieSeq}`,
        data: {
          title: value?.title
            ?.replace(/!HS|!HE/g, '')
            .replace(/\s+/g, ' ')
            .trim(),
          titleValue: value?.title,
          prodYear: value?.prodYear,
          directors: Array.isArray(value?.directors?.director)
            ? value.directors.director.slice(0, 10)
            : value?.directors?.director, // 최대 10명
          actors: Array.isArray(value?.actors?.actor) ? value.actors.actor.slice(0, 10) : value?.actors?.actor, // 최대 10명
          rating: value?.rating,
          genre: genre,
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
    const [year, month] = currentDate?.split('-').map(Number)
    const dates: string[] = []

    let date = new Date(year, month - 1) // JavaScript Date는 0부터 11까지로 월을 표현하므로, -1을 해줌

    for (let i = 0; i < 5; i++) {
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0') // 월을 2자리 숫자로 변환
      dates.push(`${year}-${month}`)
      date.setMonth(date.getMonth() - 1) // 한 달 전으로 이동
    }

    return dates.reverse()
  }
}
