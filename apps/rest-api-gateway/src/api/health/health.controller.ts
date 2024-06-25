import { Controller, Get, HttpStatus, Res } from '@nestjs/common'
import { GRPCHealthIndicator, HealthCheckService } from '@nestjs/terminus'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { ConfigService } from '@nestjs/config'

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private grpc: GRPCHealthIndicator,
    private configService: ConfigService,
  ) {}

  @Get('')
  @ApiOkResponse({ description: 'Returned if it is reachable.' })
  @ApiOperation({ description: 'Simple health check to check if an instance is reachable on the network.' })
  async check(@Res() res: Response) {
    res.status(HttpStatus.OK).send('OK')
  }
}
