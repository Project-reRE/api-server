import { Module } from '@nestjs/common'
import { MovieController } from './movie.controller'
import { MovieService } from './movie.service'
import { ConfigModule } from '@nestjs/config'
import configurations from '../../config/configurations'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MovieEntity } from '../../entity/movie.entity'
import { MovieStatisticsEntity } from '../../entity/movie-statistics.entity'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurations],
    }),
    TypeOrmModule.forFeature([MovieEntity, MovieStatisticsEntity]),
  ],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
