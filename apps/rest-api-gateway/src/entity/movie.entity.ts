import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { Transform } from 'class-transformer'
import { RevaluationEntity } from './revaluation.entity'
import { MovieStatisticsEntity } from './movie-statistics.entity'

@Entity('movies')
export class MovieEntity {
  @PrimaryColumn({ type: 'varchar', unique: true, length: 20 })
  id: string

  @Column({ type: 'json', comment: 'OPEN API 조회 결과', nullable: false })
  data: any

  @OneToMany(() => RevaluationEntity, (revaluation) => revaluation.movie)
  revaluations: RevaluationEntity[]

  @OneToMany(() => MovieStatisticsEntity, (statistics) => statistics.movie)
  statistics: MovieStatisticsEntity

  @CreateDateColumn()
  @Transform(({ value }) => (typeof value !== 'string' ? value?.toISOString() : value))
  createdAt: Date
}
