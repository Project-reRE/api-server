import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Transform } from 'class-transformer'

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

  @Column({ length: 255 })
  password: string

  @Column({ type: 'text' })
  profileUrl: string

  @Column({ type: 'varchar', unique: true, length: 255 })
  email: string

  @Column({ type: 'varchar', length: 16, nullable: false, default: 'RERE' })
  provider: string

  @Column({ type: 'varchar', length: 16, nullable: false, default: 'USER' })
  role: string

  @Column({ type: 'boolean' })
  gender: boolean

  @Column({ type: 'datetime', nullable: true, default: null })
  @Transform(({ value }) => (typeof value !== 'string' ? value?.toISOString() : value))
  birthDate: Date

  @CreateDateColumn()
  @Transform(({ value }) => (typeof value !== 'string' ? value?.toISOString() : value))
  createdDate: Date

  @UpdateDateColumn()
  @Transform(({ value }) => (typeof value !== 'string' ? value?.toISOString() : value))
  updatedDate: Date

  @DeleteDateColumn()
  @Transform(({ value }) => (typeof value !== 'string' ? value?.toISOString() : value))
  deletedDate: Date
}
