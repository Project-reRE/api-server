import { Body, Controller, Get, Header, Headers, Param, Post, Request, UseGuards, ValidationPipe } from '@nestjs/common'
import { CreateUserRequestDto } from './dto/create-user-request.dto.st'
import { CreateUserResponseDto } from './dto/create-user-response.dto'
import { FindOneUserResponseDto } from './dto/find-one-user-response.dto'
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { UserService } from './user.service'
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard'
import { AuthService } from '../auth/auth.service'

@Controller()
@ApiTags('users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

  @Get('users/:userId')
  @ApiOperation({
    summary: '유저 정보 조회',
  })
  @ApiCreatedResponse({
    type: CreateUserResponseDto,
    description: 'application/json.',
  })
  @Header('Content-Type', 'application/json')
  async findOneUser(@Param('userId') userId: string): Promise<FindOneUserResponseDto> {
    return this.userService.findOneUser({ id: userId })
  }

  @Post('users')
  @ApiOperation({
    summary: '회원 가입',
  })
  @ApiCreatedResponse({
    type: CreateUserResponseDto,
    description: 'application/json.',
  })
  async createUser(
    @Headers('oAuth-token') oAuthToken: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    request: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    let externalId = null

    const kakaoUser = await this.authService.getUserInfoForKakao(oAuthToken)
    externalId = kakaoUser.id

    return this.userService.createUser({ ...request, externalId: externalId })
  }

  @UseGuards(JwtAuthGuard)
  @Get('my/profile')
  @ApiOperation({
    summary: '유저 정보 상세 조회',
    description: 'JWT 토큰 안에 들어 있는 유저 정보',
  })
  @ApiOkResponse({ type: FindOneUserResponseDto })
  async getProfile(@Request() request): Promise<FindOneUserResponseDto> {
    console.log(request, 'getProfile')
    return request.user as FindOneUserResponseDto
  }
}
