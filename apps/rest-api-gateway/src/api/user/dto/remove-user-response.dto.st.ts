import { ApiProperty } from '@nestjs/swagger'

export class RemoveUserResponseDto {
  @ApiProperty({ example: '1', description: 'User ID' })
  id: string
}
