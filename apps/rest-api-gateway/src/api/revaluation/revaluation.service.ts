import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Between, Repository } from 'typeorm'
import { CreateRevaluationRequestDto } from './dto/create-revaluation-request.dto'
import { RevaluationEntity } from '../../entity/revaluation.entity'
import { CreateRevaluationResponseDto } from './dto/create-revaluation-response.dto'
import { MovieEntity } from '../../entity/movie.entity'
import { status as GrpcStatus } from '@grpc/grpc-js'

@Injectable()
export class RevaluationService {
  constructor(
    @InjectRepository(RevaluationEntity)
    private revaluationRepository: Repository<RevaluationEntity>,
    @InjectRepository(MovieEntity)
    private movieRepository: Repository<MovieEntity>,
  ) {}

  async createRevaluation(request: CreateRevaluationRequestDto): Promise<CreateRevaluationResponseDto> {
    console.log(request, 'createRevaluation')

    const existMovie = await this.movieRepository.findOne({
      where: {
        id: request.movieId,
      },
    })

    if (!existMovie) {
      throw new HttpException(
        {
          code: 'MOVIE_NOTFOUND',
          status: GrpcStatus.NOT_FOUND,
          message: `유효 하지 않은 영화 (id : ${request.movieId})`,
        },
        HttpStatus.NOT_FOUND,
      )
    }

    // 재평가 여부 확인
    const revaluationThresholdHour = parseInt(process.env.REVALUATION_THRESHOLD_HOUR) ?? 1
    const revaluationThresholdDate = new Date()
    revaluationThresholdDate.setHours(revaluationThresholdDate.getHours() - revaluationThresholdHour)

    const existRevaluation = await this.revaluationRepository.findOne({
      where: {
        movie: { id: request.movieId },
        user: { id: request.userId },
        createdAt: Between(revaluationThresholdDate, new Date()),
      },
    })

    if (existRevaluation) {
      throw new HttpException(
        {
          code: 'ALREADY_REVALUATION_MOVIE',
          status: HttpStatus.CONFLICT,
          message: `이미 평가한 영화(id:${existRevaluation.movie.id}, createdAt : ${existRevaluation.createdAt})`,
        },
        HttpStatus.CONFLICT,
      )
    }

    const creatableRevaluation = this.revaluationRepository.create(request)

    const createdRevaluation = await this.revaluationRepository.save(creatableRevaluation)

    console.log(createdRevaluation)

    return createdRevaluation
  }

  async findOneRevaluation(movieId: string, userId: string): Promise<RevaluationEntity> {
    const revaluation = await this.revaluationRepository.findOne({
      where: {
        movie: { id: movieId },
        user: { id: userId },
      },
    })

    if (!revaluation) {
      throw new HttpException(
        {
          code: 'REVALUATION_NOTFOUND',
          status: GrpcStatus.NOT_FOUND,
          message: `평가 내역이 없음 (movieId : ${movieId}, userId: ${userId})`,
        },
        HttpStatus.NOT_FOUND,
      )
    }

    return revaluation
  }

  async findRevaluations(movieId: string): Promise<RevaluationEntity[]> {
    const revaluations = await this.revaluationRepository
      .createQueryBuilder('revaluation')
      .innerJoinAndSelect('revaluation.movie', 'movie', 'movie.id = :movieId', { movieId })
      .innerJoinAndSelect('revaluation.user', 'user')
      .getMany()

    if (revaluations.length === 0) {
      throw new HttpException(
        {
          code: 'REVALUATIONS_NOTFOUND',
          status: GrpcStatus.NOT_FOUND,
          message: `유효 하지 않은 영화에 대한 재평가 (movieId : ${movieId})`,
        },
        HttpStatus.NOT_FOUND,
      )
    }

    return revaluations
  }
}
