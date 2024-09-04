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

    const existMovie = await this.movieRepository.findOne({
      where: { id: request.id },
      relations: { statistics: true },
    })

    if (!existMovie) {
      const creatableMovie = this.movieRepository.create({ ...request, statistics: [{}] })

      await this.movieRepository.save(creatableMovie)
    }

    return null
  }

  async findOneMovie(request: FindOneMovieRequestDto): Promise<FindOneMovieResponseDto> {
    console.log(request, 'findOneMovie')

    const existMovie = await this.movieRepository.findOne({
      where: { id: request.id },
      relations: { statistics: true },
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

    existMovie.statistics = [
      {
        id: '1',
        numRecentStars: [
          {
            currentDate: '2024-04',
            numStars: 4,
          },
          {
            currentDate: '2024-05',
            numStars: 3.5,
          },
          {
            currentDate: '2024-06',
            numStars: 4.5,
          },
          {
            currentDate: '2024-07',
            numStars: 4.2,
          },
          {
            currentDate: '2024-08',
            numStars: 5,
          },
        ],
        numStars: 4.5,
        numStarsParticipants: 5,
        numSpecialPoint: {
          PLANNING_INTENT: 3,
          DIRECTORS_DIRECTION: 6,
          ACTING_SKILLS: 1,
          SCENARIO: 20,
          OST: 10,
          SOCIAL_ISSUES: 4,
          VISUAL_ELEMENT: 5,
          SOUND_ELEMENT: 5,
        },
        numPastValuation: {
          POSITIVE: 2,
          NEGATIVE: 6,
          NOT_SURE: 5,
        },
        numPresentValuation: {
          POSITIVE: 5,
          NEGATIVE: 3,
          NOT_SURE: 6,
        },
        numGender: {
          MALE: 1,
          FEMALE: 2,
        },
        numAge: {
          TEENS: 24,
          TWENTIES: 148,
          THIRTIES: 34,
          FORTIES: 1,
          FIFTIES_PLUS: 5,
        },
        currentDate: '2024-09',
        movie: null,
      },
    ]

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
          posters: [posters ? posters + '.jpg' : null],
          stills: [stills ? stills + '.jpg' : null],
        },
      }
    })

    // 비동기로 영화 데이터 생성
    for (let i = 0; i < results.length; i++) {
      this.createMovie({ id: results[i].id, data: results[i].data })
    }

    return {
      totalRecords: results.length,
      results: results,
    }
  }
}
