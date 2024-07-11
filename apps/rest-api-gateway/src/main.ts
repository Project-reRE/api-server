import { NestFactory } from '@nestjs/core'
import { RestApiGatewayModule } from './rest-api-gateway.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AllExceptionsFilter } from '../../../libs/filter/allExceptions.filter'
import { json, urlencoded } from 'express'

async function bootstrap() {
  console.info(`Rest API Gateway Service BootStrap Doing`)
  const app = await NestFactory.create(RestApiGatewayModule)

  app.use(json({ limit: '1mb' }))
  app.use(urlencoded({ extended: true, limit: '1mb' }))

  //FIXME: enable CORS for staging/production

  if (['local', 'dev'].includes(process.env.NODE_ENV)) {
    app.enableCors({
      origin: '*', // rere dev web 주소 필요
    })
  } else if (process.env.NODE_ENV === 'production') {
    app.enableCors({
      origin: [
        //prod 배포시 rere web 주소 필요
      ],
    })
  }

  console.log(process.env.NODE_ENV)

  console.log({ kmdb: { API_KEY: process.env.KMDB_API_KEY, API_URL: process.env.KMDB_API_URL } })

  const config = new DocumentBuilder()
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }) // Add this line
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
