import { Module } from '@nestjs/common'
import { AuthModule } from './api/auth/auth.module'
import { RolesGuard } from '../../../libs/guard/roles.guard'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import configurations from './config/configurations'
import { GrpcStubUserModule } from '@grpc-stub/grpc-stub-user'
import { UserModule } from './api/user/user.module'
import { MovieModule } from './api/movie/movie.module'
import { HealthModule } from './api/health/health.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurations],
      envFilePath: [`.env`],
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
    JwtModule.register({
      secret: process.env.SERVCET_KEY,
      signOptions: { expiresIn: '1h' },
    }),
    AuthModule,
    UserModule,
    MovieModule,
    HealthModule,
  ],
  providers: [RolesGuard],
})
export class RestApiGatewayModule {}
