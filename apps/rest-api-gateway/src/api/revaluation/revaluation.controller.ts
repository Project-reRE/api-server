import { Body, Controller, Get, Param, Post, UseGuards, ValidationPipe } from '@nestjs/common'
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { RevaluationService } from './revaluation.service'
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard'
import { CreateRevaluationResponseDto } from './dto/create-revaluation-response.dto'
import { CreateRevaluationRequestDto } from './dto/create-revaluation-request.dto'
import { FindRevaluationResponseDto } from './dto/find-revaluation.response.dto'
import { FindOneRevaluationResponseDto } from './dto/find-one-revaluation-response.dto'
import { AuthUser } from '../../../../../libs/decorator/auth-user.decorator'
import { UserDto } from '../user/dto/user.dto'

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
    @AuthUser()
    user: UserDto,
    request: CreateRevaluationRequestDto,
  ): Promise<CreateRevaluationResponseDto> {
    return this.revaluationService.createRevaluation({ ...request, requestUserId: user.id })
  }

  @UseGuards(JwtAuthGuard)
  @Get('/revaluations/:movieId/:userId')
  @ApiOperation({
    summary: '특정 사용자와 영화에 대한 재평가 조회',
    description: '특정 사용자와 영화에 대한 단일 재평가를 조회합니다.',
  })
  @ApiResponse({
    type: FindOneRevaluationResponseDto,
    description: 'application/json.',
  })
  async findOneRevaluation(
    @Param('movieId') movieId: string,
    @AuthUser() user: UserDto,
  ): Promise<FindOneRevaluationResponseDto> {
    return this.revaluationService.findOneRevaluation(movieId, user.id)
  }

  // ADMIN 전용
  @UseGuards(JwtAuthGuard)
  @Get('/revaluations')
  @ApiOperation({
    summary: '특정 영화에 대한 모든 재평가 조회',
    description: '특정 영화에 대한 모든 재평가를 조회합니다.',
  })
  @ApiResponse({
    type: FindRevaluationResponseDto,
    description: 'application/json.',
  })
  async findRevaluations(
    @Param('movieId') movieId: string,
    @AuthUser() user: UserDto,
  ): Promise<FindRevaluationResponseDto> {
    const existRevaluations = await this.revaluationService.findRevaluations(movieId)

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
    @Param('movieId') movieId: string,
    @AuthUser() user: UserDto,
  ): Promise<FindRevaluationResponseDto> {
    const existRevaluations = await this.revaluationService.findRevaluations(movieId)

    return { totalRecords: existRevaluations.length, results: existRevaluations }
  }
}
