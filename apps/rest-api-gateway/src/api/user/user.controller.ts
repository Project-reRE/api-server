import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common'
import { CreateUserRequestDto } from './dto/create-user-request.dto.st'
import { CreateUserResponseDto } from './dto/create-user-response.dto'
import { plainToInstance } from 'class-transformer'
import { FindOneUserResponseDto } from './dto/find-one-user-response.dto'
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { UserService } from './user.service'
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard'

@Controller()
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/users/:userId')
  @ApiOperation({
    summary: '유저 정보 상세 조회',
    description: '유저 정보 상세 조회',
  })
  @ApiOkResponse({ type: FindOneUserResponseDto })
  async findOne(@Param('userId') userId: string): Promise<FindOneUserResponseDto> {
    console.log({ methodName: 'findOne', data: userId, context: 'userId' })

    const { user: existUser } = await this.userService.findOneUser({ id: userId })

    console.log({ methodName: 'findOne', data: existUser, context: 'existUser' })

    return plainToInstance(FindOneUserResponseDto, existUser)
  }

  @Post('/users')
  @ApiOperation({
    summary: '유저 생성',
    description: '유저 생성',
  })
  @ApiCreatedResponse({
    type: CreateUserResponseDto,
    description: 'application/json.',
  })
  async createUser(@Body() request: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    console.log({ methodName: 'createUser', data: request, context: 'request' })
    const { user: createdUser } = await this.userService.createUser(request)

    console.log({ methodName: 'createUser', data: createdUser, context: 'createdUser' })

    return plainToInstance(CreateUserResponseDto, createdUser)
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
