import { OneToMany, PrimaryColumn } from 'typeorm'
import { UserEntity } from './user.entity'

export class ProviderEntity {
  @PrimaryColumn({ type: 'varchar', length: 63 })
  code: string

  @OneToMany(() => UserEntity, (user) => user.provider)
  user: UserEntity[]
}
