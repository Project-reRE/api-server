import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { Expose, Transform } from 'class-transformer'
import { RevaluationEntity } from './revaluation.entity'
import { MovieStatisticsEntity } from './movie-statistics.entity'

@Entity('movies')
export class MovieEntity {
  @PrimaryColumn({ type: 'varchar', unique: true, length: 20 })
  @Expose()
  id: string

  @Column({ type: 'json', comment: 'OPEN API 조회 결과', nullable: false })
  @Expose()
  data: any

  @OneToMany(() => RevaluationEntity, (revaluation) => revaluation.movie)
  @Expose()
  revaluations: RevaluationEntity[]

  @OneToMany(() => MovieStatisticsEntity, (statistics) => statistics.movie)
  @Expose()
  statistics: MovieStatisticsEntity[]

  @CreateDateColumn()
  @Transform(({ value }) => (typeof value !== 'string' ? value?.toISOString() : value))
  @Expose()
  createdAt: Date
}
