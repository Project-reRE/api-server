import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Transform } from 'class-transformer'

@Entity('movie_sets')
export class MovieSetEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: string

  @Column({ type: 'varchar', length: 128, comment: '제목', nullable: false })
  title: string

  @Column({ type: 'number', length: 128, comment: '노출 순서', nullable: false })
  displayOrder: number

  @Column({
    type: 'enum',
    enum: ['SCROLL_VIEW'],
    comment: '화면 TEMPLATE',
    nullable: false,
    default: 'SCROLL_VIEW',
  })
  template: string

  @Column({
    type: 'enum',
    enum: ['MOST_REVALUATION'],
    comment: '랭킹 생성 조건',
    nullable: false,
    default: 'SCROLL_VIEW',
  })
  condition: string

  @Column({ type: 'json', comment: 'movie-set', nullable: false })
  data: any

  @CreateDateColumn()
  @Transform(({ value }) => (typeof value !== 'string' ? value?.toISOString() : value))
  createdAt: Date
}
