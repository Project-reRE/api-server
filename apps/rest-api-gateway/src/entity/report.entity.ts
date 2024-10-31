import { Transform } from 'class-transformer'
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

export const CE_REPORT_REASON = {
  1: '욕설 및 부적절한 표현',
  2: '저작권 침해',
  3: '타인의 명예 훼손',
  4: '성적인 내용',
}

@Entity('reports')
export class ReportEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'reporterId', type: 'int', comment: '신고자 id' })
  reporterId: number

  @Column({ name: 'revaluationId', type: 'int', comment: '신고 id' })
  revaluationId: number

  @Column({ name: 'reasonNumber', type: 'int', comment: '신고 사유' })
  reasonNumber: [1, 2, 3, 4]

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
