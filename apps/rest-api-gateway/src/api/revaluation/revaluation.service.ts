import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateRevaluationRequestDto } from './dto/create-revaluation-request.dto'
import { RevaluationEntity } from '../../entity/revaluation.entity'
import { CreateRevaluationResponseDto } from './dto/create-revaluation-response.dto'

@Injectable()
export class RevaluationService {
  constructor(
    @InjectRepository(RevaluationEntity)
    private revaluationRepository: Repository<RevaluationEntity>,
  ) {}

  async createRevaluation(request: CreateRevaluationRequestDto): Promise<CreateRevaluationResponseDto> {
    console.log(request, 'createRevaluation')

    const creatableRevaluation = this.revaluationRepository.create(request)

    const createdRevaluation = await this.revaluationRepository.save(creatableRevaluation)

    console.log(createdRevaluation)

    return createdRevaluation
  }
}
