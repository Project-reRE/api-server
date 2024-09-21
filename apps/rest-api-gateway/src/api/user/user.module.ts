import { forwardRef, Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '../../entity/user.entity'
import { UserService } from './user.service'
import configurations from '../../config/configurations'
import { AuthModule } from '../auth/auth.module'
import { JwtService } from '@nestjs/jwt'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurations],
    }),
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, JwtService],
})
export class UserModule {}
