import { Injectable } from '@nestjs/common';

@Injectable()
export class RestApiGatewayService {
  getHello(): string {
    return 'Hello World!';
  }
}
