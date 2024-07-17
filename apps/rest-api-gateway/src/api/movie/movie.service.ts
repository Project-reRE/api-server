import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { MovieEntity } from '../../entity/movie.entity'
import { CreateMovieRequestDto } from './dto/create-movie-request.dto'

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(MovieEntity)
    private movieRepository: Repository<MovieEntity>,
  ) {}

  async createMovie(request: CreateMovieRequestDto): Promise<void> {
    console.log(request, 'createMovie')

    const creatableMovie = this.movieRepository.create(request)

    await this.movieRepository.save(creatableMovie)

    console.log(creatableMovie)
  }
}
