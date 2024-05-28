import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import configurations from '../../grpc-user/src/config/configurations'

async function bootstrap() {
  console.log(`NODE_ENV: ${configurations().env}`)
  const app = await NestFactory.create(AppModule)

  const port = configurations().grpcPort
  await app.listen(port)

  console.log(`gRPC Movie Service is listening / PORT: ${port}`)
}

bootstrap()
