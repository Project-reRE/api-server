import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { SchedulerService } from './scheduler.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RevaluationEntity } from '../../entity/revaluation.entity'
import { MovieEntity } from '../../entity/movie.entity'
import { RankingEntity } from '../../entity/ranking.entity'
import { RankingItemEntity } from '../../entity/rankingItem.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([RevaluationEntity, MovieEntity, RankingEntity, RankingItemEntity]),
    ScheduleModule.forRoot(),
  ],
  providers: [SchedulerService],
})
export class SchedulerModule {}
