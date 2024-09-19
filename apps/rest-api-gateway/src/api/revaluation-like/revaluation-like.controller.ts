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
    summary: '평가 좋아요',
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
    summary: '평가 좋아요 취소',
  })
  @ApiCreatedResponse({
    type: RemoveRevaluationResponseDto,
    description: 'application/json.',
  })
  async removeRevaluationLikes(
    @Param('revaluationId') revaluationId: string,
    @AuthUser()
    user: UserDto,
  ): Promise<RemoveRevaluationResponseDto> {
    return this.revaluationLikeService.removeRevaluationLike({ revaluationId: revaluationId, requestUserId: user.id })
  }
}
