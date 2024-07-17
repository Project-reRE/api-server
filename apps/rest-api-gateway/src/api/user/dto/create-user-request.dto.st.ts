import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

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
    type: 'boolean',
    default: true,
    description: '남자 : true , 여자 : false',
  })
  @IsNotEmpty()
  @IsBoolean()
  readonly gender?: boolean

  @ApiProperty({ example: '2021-01-23T16:57:35.977Z' })
  @IsDateString()
  @IsNotEmpty()
  readonly birthDate?: string
}
