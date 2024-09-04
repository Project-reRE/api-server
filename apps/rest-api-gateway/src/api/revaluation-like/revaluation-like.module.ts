import { Module } from '@nestjs/common'
import { RevaluationLikeController } from './revaluation-like.controller'
import { ConfigModule } from '@nestjs/config'
import configurations from '../../config/configurations'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RevaluationLikeService } from './revaluation-like.service'
import { UserEntity } from '../../entity/user.entity'
import { RevaluationStatisticsEntity } from '../../entity/revaluation-statistics.entity'
import { RevaluationLikeEntity } from '../../entity/revaluation-like.entity'
import { RevaluationEntity } from '../../entity/revaluation.entity'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurations],
    }),
    TypeOrmModule.forFeature([UserEntity, RevaluationStatisticsEntity, RevaluationLikeEntity, RevaluationEntity]),
  ],
  controllers: [RevaluationLikeController],
  providers: [RevaluationLikeService],
})
export class RevaluationLikeModule {}
