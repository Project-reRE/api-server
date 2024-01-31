import { ManyToMany, PrimaryColumn } from 'typeorm'
import { UserEntity } from './user.entity'

export class RoleEntity {
  @PrimaryColumn({ type: 'varchar', length: 63 })
  code: string

  @ManyToMany(() => UserEntity, (user) => user.role)
  user: UserEntity[]
}
