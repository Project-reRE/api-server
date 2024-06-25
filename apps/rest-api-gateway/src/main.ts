import { NestFactory } from '@nestjs/core'
import { RestApiGatewayModule } from './rest-api-gateway.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AllExceptionsFilter } from '../../../libs/filter/allExceptions.filter'

async function bootstrap() {
  console.info(`Rest API Gateway Service BootStrap Doing`)
  const app = await NestFactory.create(RestApiGatewayModule)

  console.log(process.env.NODE_ENV)

  const config = new DocumentBuilder()
    .setTitle('API Server')
    .setDescription('The rere API description')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
  app.useGlobalFilters(new AllExceptionsFilter())

  await app.listen(3000)

  console.info(`Rest API Gateway Service is listening, PID: ${process.pid}`)
}

bootstrap()
