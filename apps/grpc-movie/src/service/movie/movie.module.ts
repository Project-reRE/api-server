import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieEntity } from '../../entity/movie.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MovieEntity]),
    HttpModule,
  ],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
