import { Body, Controller, Get, Param, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common'
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { RevaluationService } from './revaluation.service'
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard'
import { CreateRevaluationResponseDto } from './dto/create-revaluation-response.dto'
import { CreateRevaluationRequestDto } from './dto/create-revaluation-request.dto'
import { FindRevaluationResponseDto } from './dto/find-revaluation.response.dto'
import { AuthUser } from '../../../../../libs/decorator/auth-user.decorator'
import { UserDto } from '../user/dto/user.dto'
import { FindRevaluationRequestDto } from './dto/find-revaluation.request.dto'
import { FindMyRevaluationRequestDto } from './dto/find-my-revaluation.request.dto'

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
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    request: CreateRevaluationRequestDto,
    @AuthUser()
    user: UserDto,
  ): Promise<CreateRevaluationResponseDto> {
    return this.revaluationService.createRevaluation({ ...request, requestUserId: user.id })
  }

  @UseGuards(JwtAuthGuard)
  @Get('/revaluations')
  @ApiOperation({
    summary: ' 영화에 전체에 대한 모든 재평가 조회',
    description: '특정 영화에 대한 모든 재평가를 조회합니다.',
  })
  @ApiResponse({
    type: FindRevaluationResponseDto,
    description: 'application/json.',
  })
  async findRevaluations(
    @Param('movieId') movieId: string,
    @AuthUser() user: UserDto,
    @Query() query: FindRevaluationRequestDto,
  ): Promise<FindRevaluationResponseDto> {
    const existRevaluations = await this.revaluationService.findRevaluations(query)

    return { totalRecords: existRevaluations.length, results: existRevaluations }
  }

  @UseGuards(JwtAuthGuard)
  @Get('my/revaluations')
  @ApiOperation({
    summary: '특정 영화에 대한 내 재평가 리스트 조회',
    description: '특정 영화에 대한 내 재평가 리스트를 조회합니다.',
  })
  @ApiResponse({
    type: FindRevaluationResponseDto,
    description: 'application/json.',
  })
  async findMyRevaluations(
    @AuthUser() user: UserDto,
    @Query() query: FindMyRevaluationRequestDto,
  ): Promise<FindRevaluationResponseDto> {
    query.userId = user.id // TOKEN 에 있는 USER ID

    const existRevaluations = await this.revaluationService.findRevaluations(query)

    return { totalRecords: existRevaluations.length, results: existRevaluations }
  }
}
