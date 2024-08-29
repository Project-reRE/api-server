import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Transform } from 'class-transformer'
import { UserEntity } from './user.entity'
import { RevaluationEntity } from './revaluation.entity'

@Entity('revaluation_likes')
export class RevaluationLikeEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: string

  @ManyToOne(() => RevaluationEntity, (revaluation) => revaluation.revaluationLikes, { onDelete: 'CASCADE' })
  revaluation: RevaluationEntity

  @ManyToOne(() => UserEntity, (user) => user.revaluationLikes, { onDelete: 'CASCADE' })
  user: UserEntity

  @CreateDateColumn()
  @Transform(({ value }) => (typeof value !== 'string' ? value?.toISOString() : value))
  createdAt: Date

  @UpdateDateColumn()
  @Transform(({ value }) => (typeof value !== 'string' ? value?.toISOString() : value))
  updatedAt: Date

  @DeleteDateColumn()
  @Transform(({ value }) => (typeof value !== 'string' ? value?.toISOString() : value))
  deletedAt: Date
}
