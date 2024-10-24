import { Transform } from 'class-transformer'
import { Collection, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('dummy_nicknames')
export class DummyNickNameEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: string

  @Column({ type: 'varchar', length: 128, comment: '닉네임', nullable: false })
  nickName: string

  @Column({ type: 'tinyint', default: 0, comment: '사용여부', nullable: false })
  isUsed: number

  @CreateDateColumn()
  @Transform(({ value }) => (typeof value !== 'string' ? value?.toISOString() : value))
  createdAt: Date

  @UpdateDateColumn()
  @Transform(({ value }) => (typeof value !== 'string' ? value?.toISOString() : value))
  updatedAt: Date
}
