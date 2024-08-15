import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Between, Repository } from 'typeorm'
import { CreateRevaluationRequestDto } from './dto/create-revaluation-request.dto'
import { RevaluationEntity } from '../../entity/revaluation.entity'
import { CreateRevaluationResponseDto } from './dto/create-revaluation-response.dto'
import { MovieEntity } from '../../entity/movie.entity'
import { status as GrpcStatus } from '@grpc/grpc-js'
import { UserEntity } from '../../entity/user.entity'

@Injectable()
export class RevaluationService {
  constructor(
    @InjectRepository(RevaluationEntity)
    private revaluationRepository: Repository<RevaluationEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
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

    console.log(existMovie, 'createRevaluation', 'existMovie')

    if (!existMovie) {
      throw new HttpException(
        {
          code: 'MOVIE_NOTFOUND',
          status: GrpcStatus.NOT_FOUND,
          message: `존재 하지 않은 영화 정보(id : ${request.movieId})`,
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
        user: { id: request.requestUserId },
        createdAt: Between(revaluationThresholdDate, new Date()),
      },
    })

    console.log(existRevaluation, 'createRevaluation', 'existRevaluation')

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

    const existUserEntity = await this.userRepository.findOne({ where: { id: request.requestUserId } })

    const creatableRevaluation = this.revaluationRepository.create({
      ...request,
      user: existUserEntity,
      movie: existMovie,
    })

    console.log(creatableRevaluation, 'createRevaluation', 'creatableRevaluation')

    const createdRevaluation = await this.revaluationRepository.save(creatableRevaluation)

    console.log(createdRevaluation, 'createRevaluation')

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

  async findRevaluations(userId: string): Promise<RevaluationEntity[]> {
    const revaluations = await this.revaluationRepository
      .createQueryBuilder('revaluation')
      .innerJoinAndSelect('revaluation.movie', 'movie')
      .innerJoinAndSelect('revaluation.user', 'user', 'user.id = :userId', { userId })
      .getMany()

    return revaluations
  }
}
