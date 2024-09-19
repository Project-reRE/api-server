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
import { getOrder, getSkip, getTake } from '../../../../../libs/query/query'
import { UpdateRevaluationRequestDto } from './dto/update-revaluation-request.dto'
import { UpdateRevaluationResponseDto } from './dto/update-revaluation-response.dto'
import { RemoveRevaluationRequestDto } from './dto/remove-revaluation-request.dto'

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

  async updateRevaluation(request: UpdateRevaluationRequestDto): Promise<UpdateRevaluationResponseDto> {
    console.log(request, 'updateRevaluation')

    const existRevaluation = await this.revaluationRepository.findOne({
      where: {
        id: request.revaluationId,
        user: { id: request.requestUserId },
      },
      relations: { movie: true },
    })

    if (!existRevaluation) {
      throw new HttpException(
        {
          code: 'REVALUATION_NOTFOUND',
          status: GrpcStatus.NOT_FOUND,
          message: `존재 하지 않은 평가 정보(id : ${request.revaluationId})`,
        },
        HttpStatus.NOT_FOUND,
      )
    }

    // 현재 시점과 평가 생성 시점의 월 비교
    const now = dayjs() // 현재 시점
    const createdAtMonth = dayjs(existRevaluation.createdAt).month() // 평가 생성 시점의 월
    const nowMonth = now.month() // 현재 시점의 월

    if (createdAtMonth !== nowMonth) {
      throw new HttpException(
        {
          code: 'MONTH_MISMATCH',
          status: GrpcStatus.FAILED_PRECONDITION,
          message: `평가한 월에만 수정이 가능합니다.`,
        },
        HttpStatus.BAD_REQUEST,
      )
    }

    console.log(existRevaluation.id, 'updateRevaluation', 'existRevaluation')
    const beforeRevaluation = this.revaluationRepository.create(existRevaluation)
    const updatableRevaluation = this.revaluationRepository.merge(existRevaluation, request)

    const updatedRevaluation = await this.revaluationRepository.save(updatableRevaluation)
    const existUserEntity = await this.userRepository.findOne({ where: { id: request.requestUserId } })

    await this.decreaseMovieStatistics(existRevaluation.movie.id, existRevaluation, existUserEntity)
    await this.increaseMovieStatistics(existRevaluation.movie.id, updatedRevaluation, existUserEntity)

    console.log(updatedRevaluation.id, 'updatedRevaluation')

    return updatedRevaluation
  }

  async removeRevaluation(request: RemoveRevaluationRequestDto): Promise<void> {
    console.log(request, 'removeRevaluation')

    const existRevaluation = await this.revaluationRepository.findOne({
      where: {
        id: request.revaluationId,
        user: { id: request.requestUserId },
      },
      relations: { movie: true },
    })

    if (!existRevaluation) {
      throw new HttpException(
        {
          code: 'REVALUATION_NOTFOUND',
          status: GrpcStatus.NOT_FOUND,
          message: `존재 하지 않은 평가 정보(id : ${request.revaluationId})`,
        },
        HttpStatus.NOT_FOUND,
      )
    }

    const removedRevaluation = await this.revaluationRepository.softRemove(existRevaluation)

    const existUserEntity = await this.userRepository.findOne({ where: { id: request.requestUserId } })

    await this.decreaseUserStatistics(request.requestUserId)
    await this.decreaseMovieStatistics(existRevaluation.movie.id, removedRevaluation, existUserEntity)

    console.log(removedRevaluation.id, 'removeRevaluation')

    return
  }

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
          message: `이미 평가한 영화(movieId :${
            request.movieId
          }, 마지막 평가 시간 : ${existRevaluation.createdAt?.toISOString()})`,
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

    await this.increaseMovieStatistics(request.movieId, createdRevaluation, existUserEntity)

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

    const skip = getSkip(request.page, request.limit)
    const take = getTake(request.limit)
    const order = getOrder(request.order, 'revaluation')

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
      .skip(skip)
      .take(take)

    if (order) {
      Object.keys(order).forEach((key, index) =>
        index === 0 ? queryBuilder.orderBy(key, order[key]) : queryBuilder.addOrderBy(key, order[key]),
      )
    }

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

    let existUserStatistics = await this.userStatisticsRepository.findOne({ where: { user: { id: userId } } })

    if (!existUserStatistics) {
      const creatableUserStatistics = this.userStatisticsRepository.create({
        user: { id: userId },
      })

      existUserStatistics = await this.userStatisticsRepository.save(creatableUserStatistics)
    }

    console.log({ beforeUpdate: existUserStatistics }, 'increaseUserStatistics')

    existUserStatistics.numRevaluations++

    const updatedUserStatistics = await this.userStatisticsRepository.save(existUserStatistics)
    console.log({ afterUpdate: updatedUserStatistics.numRevaluations })
  }

  private async decreaseUserStatistics(userId: string) {
    console.log({ userId }, 'decreaseUserStatistics')

    let existUserStatistics = await this.userStatisticsRepository.findOne({ where: { user: { id: userId } } })

    if (!existUserStatistics) {
      return
    }

    console.log({ beforeUpdate: existUserStatistics }, 'decreaseUserStatistics')

    existUserStatistics.numRevaluations--

    const updatedUserStatistics = await this.userStatisticsRepository.save(existUserStatistics)
    console.log({ afterUpdate: updatedUserStatistics.numRevaluations })
  }

  private async getPreviousMonths(currentDate: string): Promise<string[]> {
    const [year, month] = currentDate?.split('-').map(Number)
    const dates: string[] = []

    let date = new Date(year, month - 1) // JavaScript Date는 0부터 11까지로 월을 표현하므로, -1을 해줌

    for (let i = 0; i < 5; i++) {
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0') // 월을 2자리 숫자로 변환
      dates.push(`${year}-${month}`)
      date.setMonth(date.getMonth() - 1) // 한 달 전으로 이동
    }

    return dates.reverse()
  }

  private async increaseMovieStatistics(
    movieId: string,
    revaluationEntity: RevaluationEntity,
    existUserEntity: UserEntity,
  ) {
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

      const previousMonths = await this.getPreviousMonths(currentDate)

      const numRecentStars = []

      for (let i = 0; i < previousMonths.length; i++) {
        const existMovieStatistics = await this.movieStatisticsRepository.findOne({
          where: {
            movie: { id: movieId },
            currentDate: previousMonths[i],
          },
        })

        numRecentStars.push({
          numStars: existMovieStatistics?.numStars ?? 0,
          currentDate: previousMonths[i],
        })
      }

      creatableMovieStatistics.numRecentStars = numRecentStars

      existMovieStatistics = await this.movieStatisticsRepository.save(creatableMovieStatistics)
    }

    console.log({ beforeUpdate: existMovieStatistics }, 'increaseMovieStatistics')

    const beforeTotal = existMovieStatistics.numStars * existMovieStatistics.numStarsParticipants

    existMovieStatistics.numStarsParticipants++

    const afterTotal = beforeTotal + revaluationEntity.numStars

    existMovieStatistics.numStarsTotal = afterTotal

    // decimal 은 string 으로 데이터가 자동으로 파싱됨
    existMovieStatistics.numStars = afterTotal / existMovieStatistics.numStarsParticipants

    if (!existMovieStatistics.numStars) {
      existMovieStatistics.numStars = 0
    }

    // 배열에서 currentDate가 일치하는 객체 찾기
    const targetStat = existMovieStatistics.numRecentStars.find(
      (stat: { numStars: number; currentDate: string }) => stat.currentDate === currentDate,
    )

    if (targetStat) {
      // currentDate가 일치하는 객체가 있을 때, numStars 업데이트
      targetStat.numStars = existMovieStatistics.numStars?.toFixed(1) ?? 0
    }

    // numSpecialPoint가 null일 경우 객체로 초기화
    if (!existMovieStatistics.numSpecialPoint) {
      existMovieStatistics.numSpecialPoint = {}
    }

    // 이후 존재하는 값이 있는지 확인하고 업데이트
    if (existMovieStatistics.numSpecialPoint[revaluationEntity.specialPoint]) {
      existMovieStatistics.numSpecialPoint[revaluationEntity.specialPoint]++
    } else {
      existMovieStatistics.numSpecialPoint[revaluationEntity.specialPoint] = 1
    }

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

    // numGender가 null일 경우 객체로 초기화
    if (!existMovieStatistics.numGender) {
      existMovieStatistics.numGender = {} // 빈 객체로 초기화
    }

    // 성별에 따른 처리
    if (existUserEntity.gender === true) {
      // MALE 값이 없는 경우 1로 초기화, 있으면 값 증가
      if (existMovieStatistics.numGender['MALE']) {
        existMovieStatistics.numGender['MALE']++
      } else {
        existMovieStatistics.numGender['MALE'] = 1
      }
    } else {
      // FEMALE 값이 없는 경우 1로 초기화, 있으면 값 증가
      if (existMovieStatistics.numGender['FEMALE']) {
        existMovieStatistics.numGender['FEMALE']++
      } else {
        existMovieStatistics.numGender['FEMALE'] = 1
      }
    }

    const nowDate = dayjs()
    const currentYear = nowDate.year() // 현재 연도만 가져옴

    // 사용자의 출생 연도를 숫자로 변환
    const birthYear = parseInt(existUserEntity.birthDate, 10) // 'yyyy' 형식의 birthDate를 정수로 변환

    // 나이 계산
    const age = currentYear - birthYear

    // numAge가 null일 경우 객체로 초기화
    if (!existMovieStatistics.numAge) {
      existMovieStatistics.numAge = {} // 빈 객체로 초기화
    }

    // 나이대에 따라 numAge 업데이트
    let ageGroup

    if (age >= 10 && age < 20) {
      ageGroup = 'TEENS'
    } else if (age >= 20 && age < 30) {
      ageGroup = 'TWENTIES'
    } else if (age >= 30 && age < 40) {
      ageGroup = 'THIRTIES'
    } else if (age >= 40 && age < 50) {
      ageGroup = 'FORTIES'
    } else {
      ageGroup = 'FIFTIES_PLUS'
    }

    // 해당 나이대의 값이 있는지 확인하고, 없으면 초기화
    if (existMovieStatistics.numAge[ageGroup]) {
      existMovieStatistics.numAge[ageGroup]++
    } else {
      existMovieStatistics.numAge[ageGroup] = 1
    }

    console.log(existMovieStatistics, 'increaseMovieStatistics', 'updatableMovieStatistics')

    const updatedMovieStatistics = await this.movieStatisticsRepository.save(existMovieStatistics)

    console.log({ afterUpdate: updatedMovieStatistics }, 'increaseMovieStatistics')
  }

  private async decreaseMovieStatistics(
    movieId: string,
    revaluationEntity: RevaluationEntity,
    existUserEntity: UserEntity,
  ) {
    console.log({ movieId }, 'decreaseMovieStatistics')

    const now = dayjs()
    const currentDate = now.format('YYYY-MM')

    console.log({ currentDate }, 'decreaseMovieStatistics')

    let existMovieStatistics = await this.movieStatisticsRepository.findOne({
      where: {
        movie: { id: movieId },
        currentDate: currentDate,
      },
    })

    if (!existMovieStatistics) {
      console.log('No statistics found for this movie and date.')
      return // 데이터가 없으면 반환
    }

    console.log({ beforeUpdate: existMovieStatistics }, 'decreaseMovieStatistics')

    // 총합 계산 전 기존 참가자 수가 0인지 확인
    if (existMovieStatistics.numStarsParticipants > 0) {
      const beforeTotal = existMovieStatistics.numStars * existMovieStatistics.numStarsParticipants

      existMovieStatistics.numStarsParticipants--

      const afterTotal = beforeTotal - revaluationEntity.numStars

      existMovieStatistics.numStarsTotal = afterTotal

      // 참가자 수가 0일 때 나누지 않도록 처리
      if (existMovieStatistics.numStarsParticipants > 0) {
        existMovieStatistics.numStars = afterTotal / existMovieStatistics.numStarsParticipants
      } else {
        existMovieStatistics.numStars = 0
      }
    }

    // 배열에서 currentDate가 일치하는 객체 찾기
    const targetStat = existMovieStatistics.numRecentStars.find(
      (stat: { numStars: number; currentDate: string }) => stat.currentDate === currentDate,
    )

    if (targetStat) {
      // currentDate가 일치하는 객체가 있을 때, numStars 업데이트
      targetStat.numStars = existMovieStatistics.numStars?.toFixed(1) ?? 0
    }

    // numSpecialPoint 감소 처리
    if (existMovieStatistics.numSpecialPoint && existMovieStatistics.numSpecialPoint[revaluationEntity.specialPoint]) {
      existMovieStatistics.numSpecialPoint[revaluationEntity.specialPoint]--
      if (existMovieStatistics.numSpecialPoint[revaluationEntity.specialPoint] < 0) {
        existMovieStatistics.numSpecialPoint[revaluationEntity.specialPoint] = 0 // 0 미만 방지
      }
    }

    // numPastValuation 감소 처리
    if (
      existMovieStatistics.numPastValuation &&
      existMovieStatistics.numPastValuation[revaluationEntity.pastValuation]
    ) {
      existMovieStatistics.numPastValuation[revaluationEntity.pastValuation]--
      if (existMovieStatistics.numPastValuation[revaluationEntity.pastValuation] < 0) {
        existMovieStatistics.numPastValuation[revaluationEntity.pastValuation] = 0 // 0 미만 방지
      }
    }

    // numPresentValuation 감소 처리
    if (
      existMovieStatistics.numPresentValuation &&
      existMovieStatistics.numPresentValuation[revaluationEntity.presentValuation]
    ) {
      existMovieStatistics.numPresentValuation[revaluationEntity.presentValuation]--
      if (existMovieStatistics.numPresentValuation[revaluationEntity.presentValuation] < 0) {
        existMovieStatistics.numPresentValuation[revaluationEntity.presentValuation] = 0 // 0 미만 방지
      }
    }

    // 성별에 따른 감소 처리
    if (existUserEntity.gender === true) {
      if (existMovieStatistics.numGender['MALE']) {
        existMovieStatistics.numGender['MALE']--
        if (existMovieStatistics.numGender['MALE'] < 0) {
          existMovieStatistics.numGender['MALE'] = 0 // 0 미만 방지
        }
      }
    } else {
      if (existMovieStatistics.numGender['FEMALE']) {
        existMovieStatistics.numGender['FEMALE']--
        if (existMovieStatistics.numGender['FEMALE'] < 0) {
          existMovieStatistics.numGender['FEMALE'] = 0 // 0 미만 방지
        }
      }
    }

    const nowDate = dayjs()
    const currentYear = nowDate.year()

    const birthYear = parseInt(existUserEntity.birthDate, 10)

    const age = currentYear - birthYear

    let ageGroup

    if (age >= 10 && age < 20) {
      ageGroup = 'TEENS'
    } else if (age >= 20 && age < 30) {
      ageGroup = 'TWENTIES'
    } else if (age >= 30 && age < 40) {
      ageGroup = 'THIRTIES'
    } else if (age >= 40 && age < 50) {
      ageGroup = 'FORTIES'
    } else {
      ageGroup = 'FIFTIES_PLUS'
    }

    // 나이대에 따른 감소 처리
    if (existMovieStatistics.numAge[ageGroup]) {
      existMovieStatistics.numAge[ageGroup]--
      if (existMovieStatistics.numAge[ageGroup] < 0) {
        existMovieStatistics.numAge[ageGroup] = 0 // 0 미만 방지
      }
    }

    console.log(existMovieStatistics, 'decreaseMovieStatistics', 'updatableMovieStatistics')

    const updatedMovieStatistics = await this.movieStatisticsRepository.save(existMovieStatistics)

    console.log({ afterUpdate: updatedMovieStatistics }, 'decreaseMovieStatistics')
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
