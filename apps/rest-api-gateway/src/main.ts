import { NestFactory } from '@nestjs/core';
import { RestApiGatewayModule } from './rest-api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(RestApiGatewayModule);
  await app.listen(3000);
}
bootstrap();
