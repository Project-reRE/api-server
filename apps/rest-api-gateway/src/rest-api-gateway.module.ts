import { Module } from '@nestjs/common'
import { UserModule } from '../api/user/user.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import configurations from '../../grpc-user/src/config/configurations'
import { GrpcStubUserModule } from '../../../grpc-stub/src/grpc-stub-user'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurations],
      envFilePath: [`.env.${process.env.NODE_ENV}`],
    }),
    GrpcStubUserModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        host: configService.get('grpc.user.host'),
        port: configService.get('grpc.user.port'),
        protoPath: configService.get('protoPath'),
        isEnabledSecureSsl: configService.get<boolean>('grpc.enableSecureSsl'),
      }),
    }),
    UserModule,
  ],
  // TODO GUARD, FILTER, APP_INTERCEPTOR 추가 필요
  providers: [],
})
export class RestApiGatewayModule {}
