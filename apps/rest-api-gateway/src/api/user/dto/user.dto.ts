import { IsBoolean, IsDateString, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { User } from '@grpc-idl/proto/user'

export class UserDto implements User {
  @ApiProperty({
    example: ' 1',
  })
  @IsString()
  id: string

  @ApiProperty({
    example: 'RERE_GCo6YdSwqabcd2bnLEjcx2WrgkL2',
  })
  @IsString()
  externalId: string

  @ApiProperty({
    example: 'testUser1',
  })
  @IsString()
  nickName: string

  @ApiPropertyOptional({
    example: 'This is My Description',
  })
  @IsString()
  description?: string

  @ApiPropertyOptional({
    example: 'https://asdasd.png',
  })
  @IsString()
  profileUrl?: string

  @ApiProperty({
    example: 'testUser1@test.com',
  })
  @IsString()
  email: string

  @ApiProperty({
    example: 'RERE',
  })
  @IsString()
  provider: string

  @ApiProperty({
    example: 'USER',
  })
  @IsString()
  role: string

  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  gender: boolean

  @ApiProperty({
    example: 'testUser1',
  })
  @IsString()
  birthDate: string

  @ApiProperty({ example: '2021-01-23T16:57:35.977Z' })
  @IsDateString()
  createdDate: string

  @ApiProperty({ example: '2021-01-23T16:57:35.977Z' })
  @IsDateString()
  updatedDate: string

  @ApiPropertyOptional({ example: '2021-01-23T16:57:35.977Z' })
  @IsDateString()
  deletedDate?: string | undefined
}
