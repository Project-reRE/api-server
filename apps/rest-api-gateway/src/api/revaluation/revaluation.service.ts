import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Between, Repository } from 'typeorm'
import { CreateRevaluationRequestDto } from './dto/create-revaluation-request.dto'
import { RevaluationEntity } from '../../entity/revaluation.entity'
import { CreateRevaluationResponseDto } from './dto/create-revaluation-response.dto'
import { MovieEntity } from '../../entity/movie.entity'
import { status as GrpcStatus } from '@grpc/grpc-js'
import { UserEntity } from '../../entity/user.entity'
import { FindRevaluationRequestDto } from './dto/find-revaluation.request.dto'
import { UserStatisticsEntity } from '../../entity/user-statistics.entity'
import { RevaluationStatisticsEntity } from '../../entity/revaluation-statistics.entity'
import { MovieStatisticsEntity } from '../../entity/movie-statistics.entity'
import * as dayjs from 'dayjs'

@Injectable()
export class RevaluationService {
  constructor(
    @InjectRepository(RevaluationEntity)
    private revaluationRepository: Repository<RevaluationEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(MovieEntity)
    private movieRepository: Repository<MovieEntity>,
    @InjectRepository(UserStatisticsEntity)
    private userStatisticsRepository: Repository<UserStatisticsEntity>,
    @InjectRepository(MovieStatisticsEntity)
    private movieStatisticsRepository: Repository<MovieStatisticsEntity>,
    @InjectRepository(RevaluationStatisticsEntity)
    private revaluationStatisticsRepository: Repository<RevaluationStatisticsEntity>,
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
          message: `존재 하지 않은 영화 정보(id : ${request.movieId})`,
        },
        HttpStatus.NOT_FOUND,
      )
    }

    console.log(existMovie.id, 'createRevaluation', 'existMovie')

    // 재평가 여부 확인

    const REVALUATION_THRESHOLD_HOUR = process.env.REVALUATION_THRESHOLD_HOUR || '24'

    const revaluationThresholdHour = parseInt(REVALUATION_THRESHOLD_HOUR)
    const revaluationThresholdDate = new Date()
    revaluationThresholdDate.setHours(revaluationThresholdDate.getHours() - revaluationThresholdHour)

    console.log(revaluationThresholdDate, 'createRevaluation', 'revaluationThresholdDate')

    const existRevaluation = await this.revaluationRepository.findOne({
      where: {
        movie: { id: request.movieId },
        user: { id: request.requestUserId },
        createdAt: Between(revaluationThresholdDate, new Date()),
      },
    })

    if (existRevaluation) {
      throw new HttpException(
        {
          code: 'ALREADY_REVALUATION_MOVIE',
          status: HttpStatus.CONFLICT,
          message: `이미 평가한 영화(movieId :${request.movieId}, createdAt : ${existRevaluation.createdAt})`,
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

    const createdRevaluation = await this.revaluationRepository.save(creatableRevaluation)

    await this.increaseUserStatistics(existUserEntity.id)

    await this.increaseMovieStatistics(request.movieId, createdRevaluation)

    await this.createRevaluationStatistics(createdRevaluation.id)

    console.log(createdRevaluation.id, 'createRevaluation')

    return createdRevaluation
  }

  async findOneRevaluation(movieId: string): Promise<RevaluationEntity> {
    const revaluation = await this.revaluationRepository.findOne({
      where: {
        movie: { id: movieId },
      },
      relations: { statistics: true, user: true },
    })

    if (!revaluation) {
      throw new HttpException(
        {
          code: 'REVALUATION_NOTFOUND',
          status: GrpcStatus.NOT_FOUND,
          message: `영화에 대한 평가 내역이 없음 (movieId : ${movieId})`,
        },
        HttpStatus.NOT_FOUND,
      )
    }

    return revaluation
  }

  async findRevaluations(request: FindRevaluationRequestDto): Promise<RevaluationEntity[]> {
    console.log(request, 'findRevaluations')

    const startDate = request.startDate ?? '2024-01-01 00:00:00'
    const endDate = request.endDate ?? '2099-01-01 00:00:00'

    const queryBuilder = await this.revaluationRepository
      .createQueryBuilder('revaluation')
      .innerJoinAndSelect('revaluation.movie', 'movie')
      .innerJoinAndSelect('revaluation.user', 'user')
      .leftJoinAndSelect('revaluation.statistics', 'statistics')
      .leftJoinAndSelect(
        'revaluation.revaluationLikes',
        'revaluationLikes',
        'revaluationLikes.user.id = :requestUserId',
        { requestUserId: request.requestUserId },
      )
      .where(`revaluation.createdAt between :startDate and :endDate`, { startDate: startDate, endDate: endDate })

    if (request.userId) {
      queryBuilder.andWhere(`user.id = :userId`, { userId: request.userId })
    }

    if (request.movieId) {
      queryBuilder.andWhere(`movie.id = :movieId`, { movieId: request.movieId })
    }

    const existRevaluations = await queryBuilder.getMany()

    for (let i = 0; i < existRevaluations.length; i++) {
      if (!existRevaluations[i].statistics) {
        existRevaluations[i].statistics = await this.createRevaluationStatistics(existRevaluations[i].id)
      }
    }

    return existRevaluations
  }

  private async increaseUserStatistics(userId: string) {
    console.log({ userId }, 'increaseUserStatistics')
    const existUserStatistics = await this.userStatisticsRepository.findOne({ where: { user: { id: userId } } })
    console.log({ beforeUpdate: existUserStatistics.numRevaluations })
    existUserStatistics.numRevaluations++

    const updatedUserStatistics = await this.userStatisticsRepository.save(existUserStatistics)
    console.log({ afterUpdate: updatedUserStatistics.numRevaluations })
  }

  private async increaseMovieStatistics(movieId: string, revaluationEntity: RevaluationEntity) {
    console.log({ movieId }, 'increaseMovieStatistics')

    const now = dayjs()
    const currentDate = now.format('YYYY-MM')

    console.log({ currentDate }, 'increaseMovieStatistics')

    let existMovieStatistics = await this.movieStatisticsRepository.findOne({
      where: {
        movie: { id: movieId },
        currentDate: currentDate,
      },
    })

    if (!existMovieStatistics) {
      const creatableMovieStatistics = this.movieStatisticsRepository.create({
        movie: { id: movieId },
        currentDate: currentDate,
      })

      existMovieStatistics = await this.movieStatisticsRepository.save(creatableMovieStatistics)
    }

    console.log({ beforeUpdate: existMovieStatistics }, 'increaseMovieStatistics')

    existMovieStatistics.numStarsParticipants++

    existMovieStatistics.numStarsTotal += revaluationEntity.numStars

    existMovieStatistics.numStars = existMovieStatistics.numStarsTotal / existMovieStatistics.numStarsParticipants

    console.log('DOING # 1', 'increaseMovieStatistics')

    // numSpecialPoint가 null일 경우 객체로 초기화
    if (!existMovieStatistics.numSpecialPoint) {
      console.log('DOING # 1-1', 'increaseMovieStatistics')

      existMovieStatistics.numSpecialPoint = {}
    }

    console.log('DOING # 2', 'increaseMovieStatistics')

    // 이후 존재하는 값이 있는지 확인하고 업데이트
    if (existMovieStatistics.numSpecialPoint[revaluationEntity.specialPoint]) {
      console.log('DOING # 2-1', 'increaseMovieStatistics')
      existMovieStatistics.numSpecialPoint[revaluationEntity.specialPoint]++
    } else {
      console.log('DOING # 2-2', 'increaseMovieStatistics')
      existMovieStatistics.numSpecialPoint[revaluationEntity.specialPoint] = 1
    }

    console.log('DOING # 3', 'increaseMovieStatistics')

    // numSpecialPoint가 null일 경우 객체로 초기화
    if (!existMovieStatistics.numPastValuation) {
      existMovieStatistics.numPastValuation = {}
    }

    // 이후 존재하는 값이 있는지 확인하고 업데이트
    if (existMovieStatistics.numPastValuation[revaluationEntity.pastValuation]) {
      existMovieStatistics.numPastValuation[revaluationEntity.pastValuation]++
    } else {
      existMovieStatistics.numPastValuation[revaluationEntity.pastValuation] = 1
    }

    // numSpecialPoint가 null일 경우 객체로 초기화
    if (!existMovieStatistics.numPresentValuation) {
      existMovieStatistics.numPresentValuation = {}
    }

    // 이후 존재하는 값이 있는지 확인하고 업데이트
    if (existMovieStatistics.numPresentValuation[revaluationEntity.presentValuation]) {
      existMovieStatistics.numPresentValuation[revaluationEntity.presentValuation]++
    } else {
      existMovieStatistics.numPresentValuation[revaluationEntity.presentValuation] = 1
    }

    console.log('DOING # 4', 'increaseMovieStatistics')

    const updatedUserStatistics = await this.movieStatisticsRepository.save(existMovieStatistics)

    console.log({ afterUpdate: updatedUserStatistics }, 'increaseMovieStatistics')
  }

  private async createRevaluationStatistics(revaluationId: string): Promise<RevaluationStatisticsEntity> {
    console.log({ revaluationId }, 'createRevaluationStatistics')
    const creatableRevaluationStatistics = await this.revaluationStatisticsRepository.create({
      revaluation: { id: revaluationId },
    })

    const createRevaluationStatistics = await this.revaluationStatisticsRepository.save(creatableRevaluationStatistics)

    return createRevaluationStatistics
  }
}
