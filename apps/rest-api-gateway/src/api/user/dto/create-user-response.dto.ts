import { UserDto } from './user.dto'
import { PartialType, PickType } from '@nestjs/swagger'

export class CreateUserResponseDto extends PickType(PartialType(UserDto), ['id']) {}
