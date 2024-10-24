import { Module } from '@nestjs/common'
import { AuthModule } from './api/auth/auth.module'
import { RolesGuard } from '../../../libs/guard/roles.guard'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import configurations from './config/configurations'
import { UserModule } from './api/user/user.module'
import { MovieModule } from './api/movie/movie.module'
import { HealthModule } from './api/health/health.module'
import { MovieSetModule } from './api/movie-set/movie-set.module'
import { BannerModule } from './api/banner/banner.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from './entity/user.entity'
import { MovieEntity } from './entity/movie.entity'
import { RevaluationModule } from './api/revaluation/revaluation.module'
import { RevaluationEntity } from './entity/revaluation.entity'
import { MovieStatisticsEntity } from './entity/movie-statistics.entity'
import { UserStatisticsEntity } from './entity/user-statistics.entity'
import { RevaluationStatisticsEntity } from './entity/revaluation-statistics.entity'
import { RevaluationLikeEntity } from './entity/revaluation-like.entity'
import { RevaluationLikeModule } from './api/revaluation-like/revaluation-like.module'
import { DummyNickNameEntity } from './entity/dummy.entity'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurations],
      envFilePath: [`.env`],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('database.host'),
        port: +configService.get<number>('database.port'),
        username: configService.get('database.user'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        extra: {
          idleTimeout: configService.get('database.config.idleTimeout'), // 7210 sec
          connectionLimit: configService.get('database.config.connectionLimit'),
          maxIdle: configService.get('database.config.maxIdle'),
        },
        replication: {
          master: {
            host: configService.get('database.host'),
            port: +configService.get<number>('database.port'),
            username: configService.get('database.user'),
            password: configService.get('database.password'),
            database: configService.get('database.name'),
          },
          slaves: [
            {
              host: configService.get('database.slave.host'),
              port: +configService.get<number>('database.slave.port'),
              username: configService.get('database.slave.user'),
              password: configService.get('database.slave.password'),
              database: configService.get('database.slave.name'),
            },
          ],
          /**
           * If true, PoolCluster will attempt to reconnect when connection fails. (Default: true)
           */
          canRetry: true,
          /**
           * If connection fails, specifies the number of milliseconds before another connection attempt will be made.
           * If set to 0, then node will be removed instead and never re-used. (Default: 0)
           */
        },
        entities: [
          UserEntity,
          MovieEntity,
          RevaluationEntity,
          MovieStatisticsEntity,
          UserStatisticsEntity,
          RevaluationStatisticsEntity,
          RevaluationLikeEntity,
          DummyNickNameEntity,
        ],
        timezone: configService.get('database.timezone'),
        // Set this option as false here and instead sync schema when GrpcUserModule is created to disable foreign key constraint.
        synchronize: true,
        // logging: configService.get('env') === 'development' ? ['query', 'error'] : undefined,
        logging: false,
        // configService.get('env') === 'test' ? ['error'] : configService.get('env') === 'development' ?? undefined,
      }),
      inject: [ConfigService],
    }),
    JwtModule.register({
      secret: process.env.SERVCET_KEY,
      signOptions: { expiresIn: '1h' },
    }),
    AuthModule,
    UserModule,
    MovieModule,
    HealthModule,
    MovieSetModule,
    BannerModule,
    RevaluationModule,
    RevaluationLikeModule,
  ],
  providers: [RolesGuard],
})
export class RestApiGatewayModule {}
