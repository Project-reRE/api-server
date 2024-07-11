import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { KakaoService } from './kakao.service'
import { JwtModule } from '@nestjs/jwt'
import { UserModule } from '../user/user.module'

@Module({
  imports: [JwtModule, UserModule],
  controllers: [AuthController],
  providers: [KakaoService],
  exports: [KakaoService],
})
export class AuthModule {}
