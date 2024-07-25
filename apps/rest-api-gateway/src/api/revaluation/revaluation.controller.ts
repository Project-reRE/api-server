import { Body, Controller, Headers, Post, UseGuards, ValidationPipe } from '@nestjs/common'
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RevaluationService } from './revaluation.service'
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard'
import { CreateRevaluationResponseDto } from './dto/create-revaluation-response.dto'
import { CreateRevaluationRequestDto } from './dto/create-revaluation-request.dto'

@Controller()
@ApiTags('revaluations')
@ApiBearerAuth()
export class RevaluationController {
  constructor(private readonly revaluationService: RevaluationService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/revaluations')
  @ApiOperation({
    summary: '영화 평가',
    description: '영화 평가 하기',
  })
  @ApiCreatedResponse({
    type: CreateRevaluationResponseDto,
    description: 'application/json.',
  })
  async createRevaluation(
    @Headers('oAuth-token') oAuthToken: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    request: CreateRevaluationRequestDto,
  ): Promise<CreateRevaluationResponseDto> {
    return this.revaluationService.createRevaluation(request)
  }
}
