import { ApiProperty } from '@nestjs/swagger'

export class CreateUserResponseDto {
  @ApiProperty({ example: 'asdasd' })
  jwt: string

  id?: string
  email?: string
}
