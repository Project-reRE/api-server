import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CreateUserRequestDto } from './create-user-request.dto.st'

export class UpdateUserRequestDto extends PartialType(CreateUserRequestDto) {
  @ApiProperty({ example: '1', description: 'User ID' })
  id: string
}
