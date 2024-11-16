import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common'
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
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
import { FindOneRevaluationResponseDto } from './dto/find-one-revaluation-response.dto'
import { FindRevaluationInMonthDto } from './dto/find-revaluation-in-month.dto'
import { FindRevaluationInMonthResponse } from './dto/find-revaluation-in-month-response.dto'
import { plainToInstance } from 'class-transformer'
import { ReportRevaluationDto } from './dto/report-revaluation.dto'
import { OptionalJwtAuthGuard } from '../auth/guard/OptionalJwtAuthGuard'

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

  @UseGuards(OptionalJwtAuthGuard)
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
    @Query(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    )
    query: FindRevaluationRequestDto,
  ): Promise<FindRevaluationResponseDto> {
    query.page = query.page ? Number(query.page) : query.page
    query.limit = query.limit ? Number(query.limit) : query.limit

    const [existRevaluations, count] = await this.revaluationService.findRevaluations({
      ...query,
      requestUserId: user?.id,
    })

    return {
      totalRecords: count,
      totalPages: Math.ceil(count / getTake(query.limit)),
      page: getPage(query.page),
      limit: getLimit(query.limit),
      results: existRevaluations.map((revaluation) => {
        let genre = []
        if (typeof revaluation.movie.data.genre === 'object') {
          genre = revaluation.movie.data.genre
        } else if (revaluation.movie.data.genre !== '') genre = revaluation.movie.data.genre.split(',')
        return {
          ...revaluation,
          movie: {
            ...revaluation.movie,
            data: {
              ...revaluation.movie.data,
              genre: genre,
            },
          },
        }
      }),
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/revaluations/:revaluationId')
  @ApiOperation({
    summary: ' 영화에 전체에 대한 상세 조회',
    description: '특정 영화에 대한  재평가를 상세 조회합니다.',
  })
  @ApiResponse({
    type: FindRevaluationResponseDto,
    description: 'application/json.',
  })
  async findOneRevaluations(
    @AuthUser() user: UserDto,
    @Query() query: FindRevaluationRequestDto,
    @Param('revaluationId') revaluationId: string,
  ): Promise<FindOneRevaluationResponseDto> {
    const existRevaluations = await this.revaluationService.findOneRevaluation(revaluationId)

    return existRevaluations
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

    const [existRevaluations, count] = await this.revaluationService.findRevaluations({
      ...query,
      requestUserId: user.id,
    })

    return {
      totalRecords: count,
      totalPages: Math.ceil(count / getTake(query.limit)),
      page: getPage(query.page),
      limit: getLimit(query.limit),
      results: existRevaluations.map((revaluation) => {
        let genre = []
        if (typeof revaluation.movie.data.genre === 'object') {
          genre = revaluation.movie.data.genre
        } else if (revaluation.movie.data.genre !== '') genre = revaluation.movie.data.genre.split(',')

        return {
          ...revaluation,
          movie: {
            ...revaluation.movie,
            data: {
              ...revaluation.movie.data,
              genre: genre,
            },
          },
        }
      }),
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('my/revaluations/check-in-month')
  @ApiOperation({
    description: '특정 영화에 대한 내 이번달 재평가 여부 확인',
  })
  @ApiOkResponse({ type: FindRevaluationInMonthResponse })
  async findMyRevaluationCheckerInMonth(@Query() query: FindRevaluationInMonthDto, @AuthUser() user: UserDto) {
    const result = await this.revaluationService.findRevaluationInMonth(query, user)
    return plainToInstance(FindRevaluationInMonthResponse, result, { excludeExtraneousValues: true })
  }

  @UseGuards(JwtAuthGuard)
  @Post('/revaluations/report/:revaluationId')
  @ApiOperation({
    summary: '영화 평가 신고',
  })
  async reportRevaluation(
    @Param('revaluationId', ParseIntPipe) revaluationId: number,
    @AuthUser() user: UserDto,
    @Body() body: ReportRevaluationDto,
  ): Promise<void> {
    await this.revaluationService.reportRevaluation(revaluationId, Number(user.id), body)
  }
}
