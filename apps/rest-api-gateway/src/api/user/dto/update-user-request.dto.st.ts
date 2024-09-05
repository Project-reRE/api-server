import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsEmail, IsOptional, IsString, Length, Matches } from 'class-validator'

export class UpdateUserRequestDto {
  id: string

  requestUserId: string

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
    type: 'boolean',
    default: true,
    description: '남자 : true , 여자 : false',
  })
  @IsOptional()
  @IsBoolean()
  readonly gender?: boolean

  @ApiProperty({ example: '1997' })
  @IsOptional()
  @Matches(/^\d{4}$/, { message: 'birthDate must be a valid year (yyyy)' })
  readonly birthDate?: string

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({
    type: String,
    example: 'tester@rere.com',
  })
  readonly email?: string

  @ApiPropertyOptional({ example: 'tester1' })
  @IsOptional()
  @IsString()
  nickName?: string
}
