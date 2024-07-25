import { ApiProperty } from '@nestjs/swagger'

export class MovieDataActorDto {
  @ApiProperty({ example: '황정민' })
  actorNm: string

  @ApiProperty({ example: 'Hwang Jung-min' })
  actorEnNm: string

  @ApiProperty({ example: '00007364' })
  actorId: string
}
