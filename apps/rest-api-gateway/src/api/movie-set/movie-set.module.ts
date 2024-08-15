import { Module } from '@nestjs/common'
import { MovieSetController } from './movie-set.controller'
import { ConfigModule } from '@nestjs/config'
import configurations from '../../config/configurations'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MovieSetEntity } from '../../entity/movie-set.entity'
import { MovieSetService } from './movie-set.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurations],
    }),
    TypeOrmModule.forFeature([MovieSetEntity]),
  ],
  controllers: [MovieSetController],
  providers: [MovieSetService],
})
export class MovieSetModule {}
