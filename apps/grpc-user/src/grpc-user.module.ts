import { Module } from '@nestjs/common'
import { UserController } from './service/user/user.controller'
import { UserService } from './service/user/user.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import configurations from './config/configurations'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from './entity/user.entity'
import { UserModule } from './service/user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurations],
      envFilePath: [`.env.${process.env.NODE_ENV}`],
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
        entities: [UserEntity],
        timezone: configService.get('database.timezone'),
        // Set this option as false here and instead sync schema when GrpcUserModule is created to disable foreign key constraint.
        synchronize: false,
        // logging: configService.get('env') === 'development' ? ['query', 'error'] : undefined,
        logging:
          configService.get('env') === 'test' ? ['error'] : configService.get('env') === 'development' ?? undefined,
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
})
export class GrpcUserModule {}
