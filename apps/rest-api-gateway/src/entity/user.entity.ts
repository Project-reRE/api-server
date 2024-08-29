import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Transform } from 'class-transformer'
import { RevaluationEntity } from './revaluation.entity'
import { UserStatisticsEntity } from './user-statistics.entity'
import { RevaluationLikeEntity } from './revaluation-like.entity'

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: string

  @Column({ type: 'uuid', unique: true, comment: 'oAuth UID' })
  externalId: string

  @Column({ type: 'varchar', unique: true, length: 16 })
  nickName: string

  @Column({ length: 255, default: '' })
  description: string

  @Column({ type: 'text' })
  profileUrl: string

  @Column({ type: 'varchar', unique: true, length: 255, nullable: true })
  email: string

  @Column({ type: 'varchar', length: 16, nullable: false, default: 'RERE' })
  provider: string

  @Column({ type: 'varchar', length: 16, nullable: false, default: 'USER' })
  role: string

  @Column({ type: 'boolean' })
  gender: boolean

  @Column({ type: 'varchar', length: 4, nullable: true, default: null })
  @Transform(({ value }) => (value ? value.slice(0, 4) : value))
  birthDate: string

  @OneToMany(() => RevaluationLikeEntity, (revaluationLike) => revaluationLike.revaluation)
  revaluationLikes: RevaluationLikeEntity[]

  @OneToOne(() => UserStatisticsEntity, (statistics) => statistics.user, { cascade: true })
  statistics: UserStatisticsEntity

  @CreateDateColumn()
  @Transform(({ value }) => (typeof value !== 'string' ? value?.toISOString() : value))
  createdAt: Date

  @UpdateDateColumn()
  @Transform(({ value }) => (typeof value !== 'string' ? value?.toISOString() : value))
  updatedAt: Date

  @DeleteDateColumn()
  @Transform(({ value }) => (typeof value !== 'string' ? value?.toISOString() : value))
  deletedAt: Date

  @OneToMany(() => RevaluationEntity, (revaluation) => revaluation.user)
  revaluations: RevaluationEntity[]
}
