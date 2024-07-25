import { ApiProperty } from '@nestjs/swagger'

export class UpdateUserResponseDto {
  @ApiProperty({ example: '1', description: 'User ID' })
  id: string
}
