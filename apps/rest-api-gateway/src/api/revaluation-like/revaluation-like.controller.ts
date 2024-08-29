import { Controller, Delete, Param, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RevaluationLikeService } from './revaluation-like.service'
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard'
import { CreateRevaluationResponseDto } from './dto/create-revaluation-response.dto'
import { AuthUser } from '../../../../../libs/decorator/auth-user.decorator'
import { UserDto } from '../user/dto/user.dto'
import { RemoveRevaluationResponseDto } from './dto/remove-revaluation-response.dto'

@Controller()
@ApiTags('revaluation-likes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class RevaluationLikeController {
  constructor(private readonly revaluationLikeService: RevaluationLikeService) {}

  @Post('/revaluations/:revaluationId/likes')
  @ApiOperation({
    summary: '영화 평가',
    description: '영화 평가 하기',
  })
  @ApiCreatedResponse({
    type: CreateRevaluationResponseDto,
    description: 'application/json.',
  })
  async createRevaluationLikes(
    @Param('revaluationId') revaluationId: string,
    @AuthUser()
    user: UserDto,
  ): Promise<CreateRevaluationResponseDto> {
    return this.revaluationLikeService.createRevaluationLike({ revaluationId: revaluationId, requestUserId: user.id })
  }

  @Delete('/revaluations/:revaluationId/likes')
  @ApiOperation({
    summary: '영화 평가',
    description: '영화 평가 하기',
  })
  @ApiCreatedResponse({
    type: RemoveRevaluationResponseDto,
    description: 'application/json.',
  })
  async removeRevaluationLikes(
    @Param('movieId') revaluationId: string,
    @AuthUser()
    user: UserDto,
  ): Promise<RemoveRevaluationResponseDto> {
    return this.revaluationLikeService.removeRevaluationLike({ revaluationId: revaluationId, requestUserId: user.id })
  }
}
