import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm'
import { Transform } from 'class-transformer'

@Entity('movie')
export class MovieEntity {
  @PrimaryColumn({ type: 'varchar', unique: true, length: 20 })
  id: string

  @Column({ type: 'json', comment: 'OPEN API 조회 결과', nullable: false })
  data: any

  @CreateDateColumn()
  @Transform(({ value }) => (typeof value !== 'string' ? value?.toISOString() : value))
  createdAt: Date
}
