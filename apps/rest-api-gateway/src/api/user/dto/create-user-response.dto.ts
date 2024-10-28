import { ApiProperty } from '@nestjs/swagger'

export class CreateUserResponseDto {
  @ApiProperty({ example: 'asdasd' })
  jwt: string

  @ApiProperty({ description: 'refresh token' })
  refreshToken: string

  id?: string
  email?: string
}
