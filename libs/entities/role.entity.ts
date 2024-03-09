import { Entity, ManyToMany, PrimaryColumn } from 'typeorm'
import { UserEntity } from './user.entity'

@Entity('roles')
export class RoleEntity {
  @PrimaryColumn({ type: 'varchar', length: 63 })
  code: string

  @ManyToMany(() => UserEntity, (user) => user.role)
  user: UserEntity[]
}
