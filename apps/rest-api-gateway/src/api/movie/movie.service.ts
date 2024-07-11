import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { MovieEntity } from '../../entity/movie.entity'

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(MovieEntity)
    private movieRepository: Repository<MovieEntity>,
  ) {}

  async createMovie(request: MovieEntity) {
    console.log(request)
    const creatableMovie = await this.movieRepository.create({ ...request })

    console.log(creatableMovie)
  }
}
