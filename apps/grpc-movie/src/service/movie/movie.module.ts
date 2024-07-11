import { Module } from '@nestjs/common'
import { MovieService } from './movie.service'
import { MovieController } from './movie.controller'

import { TypeOrmModule } from '@nestjs/typeorm'
import { MovieEntity } from '../../entity/movie.entity'

@Module({
  imports: [TypeOrmModule.forFeature([MovieEntity])],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
