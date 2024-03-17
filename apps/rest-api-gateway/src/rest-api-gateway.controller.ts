import { Controller, Get } from '@nestjs/common';
import { RestApiGatewayService } from './rest-api-gateway.service';

@Controller()
export class RestApiGatewayController {
  constructor(private readonly restApiGatewayService: RestApiGatewayService) {}

  @Get()
  getHello(): string {
    return this.restApiGatewayService.getHello();
  }
}
