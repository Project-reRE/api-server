import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateRevaluationRequestDto } from './dto/create-revaluation-request.dto'
import { CreateRevaluationResponseDto } from './dto/create-revaluation-response.dto'
import { RevaluationLikeEntity } from '../../entity/revaluation-like.entity'
import { RevaluationStatisticsEntity } from '../../entity/revaluation-statistics.entity'
import { status as GrpcStatus } from '@grpc/grpc-js'
import { RevaluationEntity } from '../../entity/revaluation.entity'

@Injectable()
export class RevaluationLikeService {
  constructor(
    @InjectRepository(RevaluationEntity)
    private revaluationRepository: Repository<RevaluationEntity>,
    @InjectRepository(RevaluationLikeEntity)
    private revaluationLikeRepository: Repository<RevaluationLikeEntity>,
    @InjectRepository(RevaluationStatisticsEntity)
    private revaluationStatisticsRepository: Repository<RevaluationStatisticsEntity>,
  ) {}

  async createRevaluationLike(request: CreateRevaluationRequestDto): Promise<CreateRevaluationResponseDto> {
    const existRevaluationLike = await this.revaluationLikeRepository.findOne({
      where: {
        revaluation: { id: request.revaluationId },
        user: { id: request.requestUserId },
      },
    })

    if (existRevaluationLike) {
      return { id: existRevaluationLike.id }
    }

    const existRevaluation = await this.revaluationRepository.findOne({ where: { id: request.revaluationId } })

    if (!existRevaluation) {
      throw new HttpException(
        {
          code: 'REVALUATION_NOTFOUND',
          status: GrpcStatus.NOT_FOUND,
          message: `평가 내역이 없음 `,
        },
        HttpStatus.NOT_FOUND,
      )
    }

    const creatableRevaluationLike = this.revaluationLikeRepository.create({
      revaluation: { id: existRevaluation.id },
      user: { id: request.requestUserId },
    })

    const createdRevaluationLike = await this.revaluationLikeRepository.save(creatableRevaluationLike)

    await this.increaseRevaluationStatistics(request.revaluationId)

    return { id: createdRevaluationLike.id }
  }

  async removeRevaluationLike(request: CreateRevaluationRequestDto): Promise<CreateRevaluationResponseDto> {
    const existRevaluationLike = await this.revaluationLikeRepository.findOne({
      where: {
        revaluation: { id: request.revaluationId },
        user: { id: request.requestUserId },
      },
    })

    if (!existRevaluationLike) {
      throw new HttpException(
        {
          code: 'REVALUATION_NOTFOUND',
          status: GrpcStatus.NOT_FOUND,
          message: `평가에 대한 좋아요 내역이 없음 `,
        },
        HttpStatus.NOT_FOUND,
      )
    }

    const removedRevaluationLike = await this.revaluationLikeRepository.softRemove(existRevaluationLike)

    await this.decreaseRevaluationStatistics(request.revaluationId)

    return { id: removedRevaluationLike.id }
  }

  private async increaseRevaluationStatistics(revaluationId: string) {
    const existRevaluationStatistics = await this.revaluationStatisticsRepository.findOne({
      where: { revaluation: { id: revaluationId } },
      relations: { revaluation: true },
    })

    existRevaluationStatistics.numCommentLikes++

    await this.revaluationStatisticsRepository.save(existRevaluationStatistics)
  }

  private async decreaseRevaluationStatistics(revaluationId: string) {
    const existRevaluationStatistics = await this.revaluationStatisticsRepository.findOne({
      where: { revaluation: { id: revaluationId } },
      relations: { revaluation: true },
    })

    existRevaluationStatistics.numCommentLikes--

    await this.revaluationStatisticsRepository.save(existRevaluationStatistics)
  }
}
