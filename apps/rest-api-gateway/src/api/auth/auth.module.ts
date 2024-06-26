import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { KakaoService } from './kakao.service'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [JwtModule],
  controllers: [AuthController],
  providers: [KakaoService],
  exports: [KakaoService],
})
export class AuthModule {}
