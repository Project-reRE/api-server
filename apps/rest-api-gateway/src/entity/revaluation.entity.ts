import {
  AfterLoad,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Transform } from 'class-transformer'
import { MovieEntity } from './movie.entity'
import { UserEntity } from './user.entity'
import { RevaluationStatisticsEntity } from './revaluation-statistics.entity'
import { RevaluationLikeEntity } from './revaluation-like.entity'

@Entity('revaluations')
@Index(['movie', 'user', 'createdAt'])
export class RevaluationEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: string

  @ManyToOne(() => MovieEntity, (movie) => movie.revaluations)
  movie: MovieEntity

  @ManyToOne(() => UserEntity, (user) => user.revaluations)
  user: UserEntity

  @OneToOne(() => RevaluationStatisticsEntity, (statistics) => statistics.revaluation)
  statistics: RevaluationStatisticsEntity

  @OneToMany(() => RevaluationLikeEntity, (revaluationLike) => revaluationLike.revaluation)
  revaluationLikes: RevaluationLikeEntity[]

  @Column({ type: 'decimal', precision: 2, scale: 1, comment: 'Number of Stars' })
  numStars: number

  @Column({
    type: 'enum',
    enum: [
      'PLANNING_INTENT',
      'DIRECTORS_DIRECTION',
      'ACTING_SKILLS',
      'SCENARIO',
      'OST',
      'SOCIAL_ISSUES',
      'VISUAL_ELEMENT',
      'SOUND_ELEMENT',
    ],
    comment: 'Special Point',
    nullable: true,
  })
  specialPoint: string

  @Column({
    type: 'enum',
    enum: ['POSITIVE', 'NEGATIVE', 'NOT_SURE'],
    comment: 'Past Valuation',
    nullable: true,
  })
  pastValuation: string

  @Column({
    type: 'enum',
    enum: ['POSITIVE', 'NEGATIVE', 'NOT_SURE'],
    comment: 'Present Valuation',
    nullable: true,
  })
  presentValuation: string

  @Column({ type: 'varchar', length: 100, comment: 'Comment' })
  comment: string

  @CreateDateColumn()
  @Transform(({ value }) => (typeof value !== 'string' ? value?.toISOString() : value))
  createdAt: Date

  @UpdateDateColumn()
  @Transform(({ value }) => (typeof value !== 'string' ? value?.toISOString() : value))
  updatedAt: Date

  @DeleteDateColumn()
  @Transform(({ value }) => (typeof value !== 'string' ? value?.toISOString() : value))
  deletedAt: Date

  isLiked: boolean

  @AfterLoad()
  updateUserId?() {
    if (this.revaluationLikes.length > 0) {
      this.isLiked = true
    } else {
      this.isLiked = false
    }
  }
}
