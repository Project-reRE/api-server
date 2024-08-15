import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Transform } from 'class-transformer'
import { RevaluationEntity } from './revaluation.entity'

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

  @Column({ length: 255, nullable: true })
  password: string

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

  @Column({ type: 'date', nullable: true, default: null })
  @Transform(({ value }) => (value ? value.split('T')[0] : value))
  birthDate: string

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
