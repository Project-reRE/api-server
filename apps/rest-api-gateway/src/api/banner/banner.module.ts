import { Module } from '@nestjs/common'
import { BannerController } from './banner.controller'

@Module({
  imports: [],
  controllers: [BannerController],
})
export class BannerModule {}
