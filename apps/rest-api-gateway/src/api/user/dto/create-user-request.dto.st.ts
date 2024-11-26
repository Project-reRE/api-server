import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'

export class CreateUserRequestDto {
  @ApiProperty({
    type: String,
    example: 'kakao',
  })
  @IsString()
  @IsNotEmpty()
  readonly provider: string

  //ex) Kakao uId
  readonly externalId: string

  @IsOptional()
  @Length(0, 2048)
  @ApiPropertyOptional({
    type: String,
    example: 'https://asdasd.png',
  })
  readonly profileUrl?: string

  @IsOptional()
  @Length(0, 100)
  @ApiPropertyOptional({
    type: String,
    example: 'description for the user',
  })
  readonly description?: string

  @ApiProperty({
    type: String || Boolean,
    default: true,
    description: "'MALE', 'FEMALE', 'UNKNOWN'",
    enum: ['MALE', 'FEMALE', 'UNKNOWN'],
  })
  @IsNotEmpty()
  // @IsEnum(['MALE', 'FEMALE', 'UNKNOWN'])
  @Transform(({ value }) => {
    return typeof value === 'boolean' ? (value ? 'MALE' : 'FEMALE') : value
  })
  readonly gender: 'MALE' | 'FEMALE' | 'UNKNOWN'

  @ApiPropertyOptional({ example: '1997' })
  @IsOptional()
  @Matches(/^\d{4}$/, { message: 'birthDate must be a valid year (yyyy)' })
  readonly birthDate?: string

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({
    type: String,
    example: 'tester@rere.com',
  })
  email?: string
}
