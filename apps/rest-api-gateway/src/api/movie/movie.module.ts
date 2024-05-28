import { Module } from '@nestjs/common'
import { MovieController } from './movie.controller'

@Module({
  imports: [],
  controllers: [MovieController],
})
export class MovieModule {}
