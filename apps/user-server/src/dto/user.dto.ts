import { RoleDto } from './role.dto'
import { ProviderDto } from './provider.dto'

export class UserDto {
  id: number
  username: string
  password: string
  email: string
  verified: boolean
  createdAt: Date
  updatedAt: Date
  role: RoleDto[]
  provider: ProviderDto
}
