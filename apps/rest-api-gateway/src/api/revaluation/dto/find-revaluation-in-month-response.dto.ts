import { ApiProperty, PickType } from '@nestjs/swagger'
import { RevaluationEntity } from 'apps/rest-api-gateway/src/entity/revaluation.entity'
import { Expose } from 'class-transformer'

export class FindRevaluationInMonthResponse {
  @ApiProperty({ type: String })
  @Expose()
  id: string

  @ApiProperty({ type: Number })
  @Expose()
  numStars: number

  @ApiProperty({ type: String })
  @Expose()
  specialPoint: string

  @ApiProperty({ type: String })
  @Expose()
  pastValuation: string

  @ApiProperty({ type: String })
  @Expose()
  presentValuation: string

  @ApiProperty({ type: String })
  @Expose()
  comment: string

  @ApiProperty({ type: Date })
  @Expose()
  createdAt: Date

  @ApiProperty({ type: Date })
  @Expose()
  updatedAt: Date

  @ApiProperty({ type: Date })
  @Expose()
  deletedAt: Date

  @ApiProperty({ type: Boolean })
  @Expose()
  isLiked: boolean
}
