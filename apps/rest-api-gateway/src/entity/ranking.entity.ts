import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('ranking')
export class RankingEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  @ApiProperty({ description: 'id' })
  id: number

  @Column({ name: 'title', type: 'varchar', length: 255, comment: 'view title' })
  @ApiProperty({ description: 'title' })
  @Expose()
  title: string

  @Column({ name: 'genre', type: 'varchar', length: 255, comment: 'genre' })
  @ApiProperty({ description: 'genre' })
  @Expose()
  genre: string

  @Column({ name: 'displayOrder', type: 'int', comment: 'displayOrder' })
  @ApiProperty({ description: 'displayOrder' })
  @Expose()
  displayOrder: number

  @Column({ name: 'condition', type: 'varchar', length: 255, comment: 'condition' })
  @ApiProperty({ description: 'condition' })
  @Expose()
  condition: string

  @Column({ name: 'template', type: 'varchar', length: 255, comment: 'template' })
  @ApiProperty({ description: 'template' })
  @Expose()
  template: string

  @Column({ name: 'activeAt', type: 'datetime', comment: 'activeAt' })
  @ApiProperty({ description: 'activeAt' })
  @Expose()
  activeAt: Date
}
