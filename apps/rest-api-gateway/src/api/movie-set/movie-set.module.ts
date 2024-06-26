import { Module } from '@nestjs/common'
import { MovieSetController } from './movie-set.controller'

@Module({
  imports: [],
  controllers: [MovieSetController],
})
export class MovieSetModule {}
