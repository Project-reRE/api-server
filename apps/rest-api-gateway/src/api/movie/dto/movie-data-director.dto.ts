import { ApiProperty } from '@nestjs/swagger'

export class MovieDataDirectorDto {
  @ApiProperty({ example: '류승완' })
  directorNm: string

  @ApiProperty({ example: 'Ryoo Seung-wan' })
  directorEnNm: string

  @ApiProperty({ example: '00004003' })
  directorId: string
}
