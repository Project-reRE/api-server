import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class FindOneMovieRequestDto {
  @ApiProperty({ example: 'F-0000', description: 'MOVIE ID + MOVIE SEQ' })
  @IsNotEmpty()
  @IsString()
  id: string
}
