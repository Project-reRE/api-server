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

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(MovieEntity)
    private movieRepository: Repository<MovieEntity>,
  ) {}

  async createMovie(request: CreateMovieRequestDto): Promise<void> {
    console.log(request, 'createMovie')

    const existMovie = this.movieRepository.findOne({ where: { id: request.id } })

    if (!existMovie) {
      const creatableMovie = this.movieRepository.create(request)

      await this.movieRepository.save(creatableMovie)
    }

    return null
  }

  async findOneMovie(request: FindOneMovieRequestDto): Promise<FindOneMovieResponseDto> {
    console.log(request, 'findOneMovie')

    const existMovie = this.movieRepository.findOne({ where: { id: request.id } })

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
          posters: value?.posters?.toLowerCase()?.split('.jpg')[0] + '.jpg',
          stlls: value?.stlls?.toLowerCase()?.split('.jpg')[0] + '.jpg',
        },
      }
    })

    // 비동기로 영화 데이터 생성
    for (let i = 0; i < results.length; i++) {
      this.createMovie({ id: results[i].id, data: results[i].data })
    }

    return {
      totalRecords: existMovieData.data.Data[0].Result.length,
      results: results,
    }
  }
}
