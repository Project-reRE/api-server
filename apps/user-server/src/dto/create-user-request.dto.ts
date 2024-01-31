import { RoleDto } from './role.dto'
import { ProviderDto } from './provider.dto'

export class CreateUserRequestDto {
  username: string
  password: string
  email: string
  provider: ProviderDto
  role: RoleDto
}
