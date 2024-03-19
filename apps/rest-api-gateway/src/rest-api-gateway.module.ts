import { Module, OnApplicationBootstrap } from '@nestjs/common'
import { UserModule } from '../api/user/user.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import configurations from '../../grpc-user/src/config/configurations'
import { GrpcStubUserModule } from '../../../grpc-stub/src/grpc-stub-user'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core'
import { ClsGuard, ClsInterceptor } from 'nestjs-cls'
import { Server } from 'http'
import { TimeoutInterceptor } from '../../../libs/interceptor/timeout.interceptor'

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
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
  ],
})
export class RestApiGatewayModule implements OnApplicationBootstrap {
  constructor(private readonly refHost: HttpAdapterHost<any>) {}

  onApplicationBootstrap() {
    const server: Server = this.refHost.httpAdapter.getHttpServer()
    server.keepAliveTimeout = 61 * 1000
    server.headersTimeout = 65 * 1000
  }
}
