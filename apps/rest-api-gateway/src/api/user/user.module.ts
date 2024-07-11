import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '../../entity/user.entity'
import { UserService } from './user.service'
import configurations from '../../config/configurations'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurations],
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
