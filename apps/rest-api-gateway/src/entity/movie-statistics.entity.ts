import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Transform } from 'class-transformer'
import { MovieEntity } from './movie.entity'

@Entity('movie_statistics')
export class MovieStatisticsEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: string

  @ManyToOne(() => MovieEntity, (movie) => movie.statistics, { onDelete: 'CASCADE' })
  movie: MovieEntity

  @Column({
    type: 'decimal',
    precision: 2,
    scale: 1,
    default: 0,
    comment: '해당월 Movie 평균 평점(별점의 총점 / 별점 부여자 수)',
    transformer: {
      to: (value: number) => value, // DB에 저장될 때는 그대로 저장
      from: (value: string) => parseFloat(value), // DB에서 가져올 때 문자열을 숫자로 변환
    },
  })
  numStars: number

  @Column({
    type: 'decimal',
    precision: 2,
    scale: 1,
    default: 0,
    comment: '해당월 Movie Total (기록용)',
    transformer: {
      to: (value: number) => value, // DB에 저장될 때는 그대로 저장
      from: (value: string) => parseFloat(value), // DB에서 가져올 때 문자열을 숫자로 변환
    },
  })
  numStarsTotal?: number

  @Column({
    type: 'json',
    nullable: true,
    comment: '최근(5달) Movie 평균 평점(별점의 총점 / 별점 부여자 수)',
  })
  numRecentStars: any

  @Column({ type: 'integer', default: 0, comment: '해당 Movie 에 별점을 부여한 사용자 수' })
  numStarsParticipants: number

  @Column({ type: 'json', nullable: true, comment: 'specialPoint 별 사용자 평가' })
  numSpecialPoint: any

  @Column({ type: 'json', nullable: true, comment: "pastValuation 별 사용자 평가'" })
  numPastValuation: any

  @Column({ type: 'json', nullable: true, comment: "presentValuation 별 사용자 평가'" })
  numPresentValuation: any

  @Column({ type: 'json', nullable: true, comment: '영화를 평가한 Gender Count' })
  numGender: any

  @Column({ type: 'json', nullable: true, comment: '영화를 평가한 Age Count' })
  numAge: any

  @Column({ type: 'varchar', comment: '재평가 기준 일' })
  currentDate: string

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
