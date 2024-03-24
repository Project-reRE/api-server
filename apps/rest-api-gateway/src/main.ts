import { NestFactory } from '@nestjs/core'
import { RestApiGatewayModule } from './rest-api-gateway.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(RestApiGatewayModule)

  const config = new DocumentBuilder()
    .setTitle('API Server')
    .setDescription('The rere API description')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(3000)
}

bootstrap()
