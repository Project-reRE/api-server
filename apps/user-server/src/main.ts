import { NestFactory } from '@nestjs/core'
import { UserServerModule } from './user-server.module'
import 'reflect-metadata'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(UserServerModule)

  const config = new DocumentBuilder()
    .setTitle('User server Swagger')
    .setDescription('User server API Description')
    .setVersion('1.0')
    .addTag('APIS')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  console.log('USER SERVER START')
  await app.listen(3000)
}

bootstrap()
