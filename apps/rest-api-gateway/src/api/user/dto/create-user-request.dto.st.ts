import { IsBoolean, IsDateString, IsEmail, IsISO8601, IsNotEmpty, IsOptional, Length, Matches } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { CreateUserRequest } from '@grpc-idl/proto/user'

export class CreateUserRequestDto implements CreateUserRequest {
  @IsOptional()
  @Length(6, 16)
  @ApiProperty({
    type: String,
    example: 'testUser1',
  })
  nickName: string

  // 33 characters are allowed: !"#$%&'()*+,-./:;<=>?@[＼]^_`{|}~\
  @Matches(/^([a-zA-Z0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~\\]+)$/)
  @Length(8, 25)
  @ApiPropertyOptional({
    type: String,
    example: 'Ab#$1234',
  })
  @IsOptional()
  readonly password: string

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'RERE_GCo6YdSwqabcd2bnLEjcx2WrgkL2',
    description: 'Provider 에서 생성한 oAuth UUID',
  })
  readonly externalId: string

  @IsOptional()
  @Length(0, 2048)
  @ApiPropertyOptional({
    type: String,
    example: 'https://asdasd.png',
  })
  readonly profileUrl?: string

  @ApiProperty({
    type: String,
    example: 'testUser1@test.com',
  })
  @IsEmail()
  readonly email: string

  @IsOptional()
  @Length(0, 100)
  @ApiPropertyOptional({
    type: String,
    example: 'description for the user',
  })
  readonly description?: string

  @ApiProperty({
    type: 'boolean',
    default: true,
    description: '남자 : true , 여자 : false',
  })
  @IsNotEmpty()
  @IsBoolean()
  readonly gender: boolean

  @ApiProperty({ example: '2021-01-23T16:57:35.977Z' })
  @IsDateString()
  @IsNotEmpty()
  readonly birthDate: string
}
