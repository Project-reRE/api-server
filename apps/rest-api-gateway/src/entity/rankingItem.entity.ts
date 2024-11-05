import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('rankingItem')
export class RankingItemEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number

  @Column({ name: 'movieId', type: 'varchar', length: 255, comment: 'movieId' })
  @ApiProperty({ description: 'movieId' })
  @Expose()
  movieId: string

  @Column({ name: 'rankId', type: 'int', comment: 'rankId' })
  @ApiProperty({ description: 'rankId' })
  @Expose()
  rankId: number

  @Column({ name: 'count', type: 'int', comment: 'count' })
  @ApiProperty({ description: 'count' })
  @Expose()
  count: number

  @Column({ name: 'order', type: 'int', comment: 'order' })
  @ApiProperty({ description: 'order' })
  @Expose()
  order: number
}
