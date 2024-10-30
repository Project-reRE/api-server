import { Module } from '@nestjs/common'
import { CommonController } from './common.controller'
import { CommonService } from './common.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { VersionEntity } from '../../entity/version.entity'

@Module({
  imports: [TypeOrmModule.forFeature([VersionEntity])],
  controllers: [CommonController],
  providers: [CommonService],
})
export class CommonModule {}
