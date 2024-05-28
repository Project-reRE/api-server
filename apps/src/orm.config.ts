import { TypeOrmModuleOptions } from "@nestjs/typeorm";

function ormConfig(): TypeOrmModuleOptions {
    const commonConf = {
        SYNCRONIZE: false,
        ENTITIES: [__dirname + '/**/entities/*{.ts,.js}'],
        MIGRATIONS: [__dirname + '/migrations/**/*{.ts,.js}'],
        MIGRATIONS_RUN: false,
    };

    return {
        name: 'default',
        type: 'mysql',
        database: 'rere-dev',
        host: 'localhost',
        port: Number(3306),
        username: 'root',
        password: '852963',
        logging: true,
        synchronize: commonConf.SYNCRONIZE,
        entities: commonConf.ENTITIES,
        migrations: commonConf.MIGRATIONS,
        migrationsRun: commonConf.MIGRATIONS_RUN,
    };
}

export { ormConfig };