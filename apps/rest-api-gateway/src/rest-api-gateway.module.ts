import { Module } from '@nestjs/common'
import { RestApiGatewayController } from './rest-api-gateway.controller'
import { RestApiGatewayService } from './rest-api-gateway.service'

@Module({
  imports: [],
  controllers: [RestApiGatewayController],
  providers: [RestApiGatewayService],
})
export class RestApiGatewayModule {}
