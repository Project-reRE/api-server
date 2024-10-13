import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { MovieSetEntity } from '../../entity/movie-set.entity'

@Injectable()
export class MovieSetService {
  constructor(
    @InjectRepository(MovieSetEntity)
    private movieRepository: Repository<MovieSetEntity>,
  ) {}

  async findOneMovieSet(request: any): Promise<any> {
    // console.log(request, 'findOneMovieSet')

    const existMovie = await this.movieRepository.findOne({ where: { id: request.id } })

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

    // console.log(existMovie, 'findOneMovie')

    return existMovie
  }

  async findMovieSet(request: any): Promise<any> {
    // console.log(request, 'findOneMovieSet')

    const existMovie = await this.movieRepository.findOne({ where: { id: request.id } })

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

    // console.log(existMovie, 'findOneMovie')

    return existMovie
  }
}
