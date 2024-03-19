import { NestFactory } from '@nestjs/core'
import { GrpcUserModule } from './grpc-user.module'
import { GrpcOptions, Transport } from '@nestjs/microservices'
import configurations from './config/configurations'
import { ValidationPipe } from '@nestjs/common'
import { ServerCredentials } from '@grpc/grpc-js'
import { join } from 'path'
import { USER_PACKAGE_NAME } from '@grpc-idl/proto/user'

async function bootstrap() {
  console.log(`NODE_ENV: ${configurations().env}`)

  const grpcPort = configurations().grpcPort
  const protoPath = configurations().protoPath

  const app = await NestFactory.create(GrpcUserModule)
  // const configService = app.get<ConfigService>(ConfigService)

  const grpcMicroservice = app.connectMicroservice<GrpcOptions>(
    {
      transport: Transport.GRPC,
      options: {
        url: `0.0.0.0:${grpcPort}`,
        package: [USER_PACKAGE_NAME],
        protoPath: [join(__dirname, protoPath + 'user.proto')],
        maxSendMessageLength: 1024 * 1024 * 100,
        maxReceiveMessageLength: 1024 * 1024 * 100,
        loader: {
          enums: String,
          objects: true,
          arrays: true,
          json: true,
        },
        credentials: ServerCredentials.createInsecure(),
      },
    },
    { inheritAppConfig: true },
  )

  app.useGlobalPipes(new ValidationPipe())
  // app.useGlobalInterceptors(new LoggerGlobalInterceptor())

  await app.startAllMicroservices()
  console.log(`gRPC User Service is listening / PORT: ${grpcPort}`)
}

bootstrap()
