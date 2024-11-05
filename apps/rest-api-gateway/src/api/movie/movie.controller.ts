import { Controller, Get, Param, Query, ValidationPipe } from '@nestjs/common'
import { FindMovieQueryDto } from './dto/find-movie.query.dto'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger'
import { FindMovieResponseDto } from './dto/find-movie.response.dto'
import { MovieService } from './movie.service'
import { FindOneMovieResponseDto } from './dto/find-one-movie-response.dto'
import { FindOneMovieQueryDto } from './dto/find-one-movie-query.dto'
import { plainToInstance } from 'class-transformer'
import { MovieEntity } from '../../entity/movie.entity'
import { RankingEntity } from '../../entity/ranking.entity'
import { FindRankDto } from './dto/find-rank.dto'

@Controller()
@ApiTags('movies')
@ApiBearerAuth()
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  // @UseGuards(JwtAuthGuard)
  @Get('/movies')
  @ApiOperation({
    summary: '영화 검색',
    description: 'KMDB API를 사용하여 영화를 검색합니다.',
  })
  @ApiOkResponse({ type: FindMovieResponseDto })
  async findMovies(
    @Query(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    )
    request: FindMovieQueryDto,
  ): Promise<FindMovieResponseDto> {
    return this.movieService.findMovies(request)
  }

  @Get('/movies/ranking')
  @ApiOkResponse({ type: FindRankDto, isArray: true })
  async rank() {
    return plainToInstance(FindRankDto, await this.movieService.rank(), { excludeExtraneousValues: true })
  }

  @Get('/movies/:movieId')
  @ApiOperation({
    summary: '영화 상세 검색',
    description: '영화 상세 정보 검색',
  })
  @ApiOkResponse({ type: FindOneMovieResponseDto })
  async findOneMovie(
    @Param('movieId') movieId: string,
    @Query(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    )
    request: FindOneMovieQueryDto,
  ): Promise<FindOneMovieResponseDto> {
    return plainToInstance(
      FindOneMovieResponseDto,
      await this.movieService.findOneMovie({ id: movieId, currentDate: request.currentDate ?? '2024-09' }),
      { excludeExtraneousValues: true },
    )
  }
}
