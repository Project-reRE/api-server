import { Module } from '@nestjs/common'
import { RevaluationController } from './revaluation.controller'
import { ConfigModule } from '@nestjs/config'
import configurations from '../../config/configurations'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RevaluationEntity } from '../../entity/revaluation.entity'
import { RevaluationService } from './revaluation.service'
import { MovieEntity } from '../../entity/movie.entity'
import { UserEntity } from '../../entity/user.entity'
import { UserStatisticsEntity } from '../../entity/user-statistics.entity'
import { RevaluationStatisticsEntity } from '../../entity/revaluation-statistics.entity'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurations],
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      RevaluationEntity,
      MovieEntity,
      UserStatisticsEntity,
      RevaluationStatisticsEntity,
    ]),
  ],
  controllers: [RevaluationController],
  providers: [RevaluationService],
})
export class RevaluationModule {}
