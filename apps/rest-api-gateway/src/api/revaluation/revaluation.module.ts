import { Module } from '@nestjs/common'
import { RevaluationController } from './revaluation.controller'

import { ConfigModule } from '@nestjs/config'
import configurations from '../../config/configurations'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RevaluationEntity } from '../../entity/revaluation.entity'
import { RevaluationService } from './revaluation.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurations],
    }),
    TypeOrmModule.forFeature([RevaluationEntity]),
  ],
  controllers: [RevaluationController],
  providers: [RevaluationService],
})
export class RevaluationModule {}
