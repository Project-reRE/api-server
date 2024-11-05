import { ApiProperty } from '@nestjs/swagger'
import { MovieEntity } from 'apps/rest-api-gateway/src/entity/movie.entity'
import { RankingEntity } from 'apps/rest-api-gateway/src/entity/ranking.entity'
import { Expose } from 'class-transformer'

export class FindRankDto extends RankingEntity {
  @ApiProperty({ type: MovieEntity, isArray: true })
  @Expose()
  data: MovieEntity[]
}
