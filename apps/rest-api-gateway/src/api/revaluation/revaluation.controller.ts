import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common'
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
import { getLimit, getPage, getTake } from '../../../../../libs/query/query'
import { UpdateRevaluationRequestDto } from './dto/update-revaluation-request.dto'
import { UpdateRevaluationResponseDto } from './dto/update-revaluation-response.dto'

@Controller()
@ApiTags('revaluations')
@ApiBearerAuth()
export class RevaluationController {
  constructor(private readonly revaluationService: RevaluationService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/revaluations')
  @ApiOperation({
    summary: '영화 평가',
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
  @Put('/revaluations/:revaluationId')
  @ApiOperation({
    summary: '영화 평가 수정',
  })
  @ApiCreatedResponse({
    type: UpdateRevaluationRequestDto,
    description: 'application/json.',
  })
  async updateRevaluation(
    @Param('revaluationId') revaluationId: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    request: UpdateRevaluationRequestDto,
    @AuthUser()
    user: UserDto,
  ): Promise<UpdateRevaluationResponseDto> {
    return this.revaluationService.updateRevaluation({
      ...request,
      revaluationId: revaluationId,
      requestUserId: user.id,
    })
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/revaluations/:revaluationId')
  @ApiOperation({
    summary: '영화 평가 삭제',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeRevaluation(
    @Param('revaluationId') revaluationId: string,
    @AuthUser()
    user: UserDto,
  ): Promise<void> {
    return this.revaluationService.removeRevaluation({ revaluationId: revaluationId, requestUserId: user.id })
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
    @AuthUser() user: UserDto,
    @Query() query: FindRevaluationRequestDto,
  ): Promise<FindRevaluationResponseDto> {
    const existRevaluations = await this.revaluationService.findRevaluations({
      ...query,
      requestUserId: user.id,
    })

    return {
      totalRecords: existRevaluations.length,
      results: existRevaluations,
      totalPages: Math.ceil(existRevaluations.length / getTake(query.limit)),
      page: getPage(query.page),
      limit: getLimit(query.limit),
    }
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
    query.userId = user.id

    const existRevaluations = await this.revaluationService.findRevaluations({ ...query, requestUserId: user.id })

    return {
      totalRecords: existRevaluations.length,
      results: existRevaluations,
      totalPages: Math.ceil(existRevaluations.length / getTake(query.limit)),
      page: getPage(query.page),
      limit: getLimit(query.limit),
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('my/revaluations/id')
  @ApiOperation({
    summary: '특정 영화에 대한 내 재평가 리스트 ID 값 조회',
    description: '특정 영화에 대한 내 재평가 리스트를 조회합니다.',
  })
  @ApiResponse({
    type: FindRevaluationResponseDto,
    description: 'application/json.',
  })
  async findMyRevaluationsEnable(
    @AuthUser() user: UserDto,
    @Query() query: FindMyRevaluationRequestDto,
  ): Promise<string> {
    query.userId = user.id

    const existRevaluations = await this.revaluationService.findRevaluations({ ...query, requestUserId: user.id })

    return existRevaluations[0].id
  }
}
