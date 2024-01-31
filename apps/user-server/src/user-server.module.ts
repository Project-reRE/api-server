import { Module } from '@nestjs/common'
import { UsersModule } from './service/user/users.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import configurations from './config/configurations'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from './entities/user.entity'
import { RoleEntity } from './entities/role.entity'
import { ProviderEntity } from './entities/provider.entity'

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
        entities: [UserEntity, RoleEntity, ProviderEntity],
        timezone: configService.get('database.timezone'),
        synchronize: true, // TODO 마이그레이션 기능 추가 되면 false 로 변경
        logging: true,
      }),
      inject: [ConfigService],
    }),
    /**redis 및 Cache Manager 추가 필요*/
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class UserServerModule {}
