import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

export const CE_VERSION_PLATFORM = {
  AOS: 'aos',
  IOS: 'ios',
}

export type CE_VERSION_PLATFORM = (typeof CE_VERSION_PLATFORM)[keyof typeof CE_VERSION_PLATFORM]

@Entity('version')
export class VersionEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255, nullable: false, name: 'platform' })
  @ApiProperty({ description: '플랫폼' })
  @Expose()
  platform: CE_VERSION_PLATFORM

  @Column({ type: 'varchar', length: 255, nullable: false, name: 'stableVersion' })
  @ApiProperty({ description: '안정 버전' })
  @Expose()
  stableVersion: string

  @Column({ type: 'varchar', length: 255, nullable: false, name: 'minimumVersion' })
  @ApiProperty({ description: '최소 버전 (이하면 강업)' })
  @Expose()
  minimumVersion: string
}
