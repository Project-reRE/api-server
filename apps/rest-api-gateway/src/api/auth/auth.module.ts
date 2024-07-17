import { forwardRef, Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from '../../constants/jwt'
import { JwtStrategy } from './strategy/jwt.strategy'
import { AuthService } from './auth.service'
import { UserModule } from '../user/user.module'

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' },
    }),
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
