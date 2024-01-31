import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { RoleEntity } from './role.entity'
import { ProviderEntity } from './provider.entity'

export class UserEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number

  @Column({ length: 63, unique: true })
  username: string

  @Column({ length: 255 })
  password: string

  @Column({ length: 255 })
  @Index()
  email: string

  @Column({ type: 'boolean', default: false })
  verified: boolean

  @Column({ type: 'datetime', default: null, nullable: true })
  verifiedAt: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  @ManyToMany(() => RoleEntity, (role) => role.user)
  @JoinTable({
    name: 'user_role',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'roleCode', referencedColumnName: 'code' },
  })
  role: RoleEntity[]

  @ManyToOne(() => ProviderEntity, (provider) => provider.user)
  provider: ProviderEntity
}
