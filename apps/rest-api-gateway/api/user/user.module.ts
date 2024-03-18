import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { ConfigService } from '@nestjs/config'
import { GrpcStubUserModule } from '@grpc-stub/grpc-stub-user'

@Module({
  imports: [
    GrpcStubUserModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        host: configService.get('grpc.user.host'),
        port: configService.get('grpc.user.port'),
        protoPath: configService.get('protoPath'),
        isEnabledSecureSsl: configService.get<boolean>('grpc.enableSecureSsl'),
      }),
    }),
  ],
  controllers: [UserController],
})
export class UserModule {}
