import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Transform } from 'class-transformer'
import { RevaluationEntity } from './revaluation.entity'

@Entity('revaluation_statistics')
export class RevaluationStatisticsEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: string

  @OneToOne(() => RevaluationEntity, (revaluation) => revaluation.statistics, { onDelete: 'CASCADE' })
  @JoinColumn()
  revaluation: RevaluationEntity

  @Column({ type: 'integer', default: 0, comment: '해당 Revaluation 에 Like 를 누른 사용자 수' })
  numCommentLikes: number

  @CreateDateColumn()
  @Transform(({ value }) => (typeof value !== 'string' ? value?.toISOString() : value))
  createdAt?: Date

  @UpdateDateColumn()
  @Transform(({ value }) => (typeof value !== 'string' ? value?.toISOString() : value))
  updatedAt?: Date

  @DeleteDateColumn()
  @Transform(({ value }) => (typeof value !== 'string' ? value?.toISOString() : value))
  deletedAt?: Date
}
