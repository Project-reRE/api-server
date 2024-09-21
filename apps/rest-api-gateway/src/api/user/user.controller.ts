import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common'
import { CreateUserRequestDto } from './dto/create-user-request.dto.st'
import { CreateUserResponseDto } from './dto/create-user-response.dto'
import { FindOneUserResponseDto } from './dto/find-one-user-response.dto'
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { UserService } from './user.service'
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard'
import { AuthService } from '../auth/auth.service'
import { AuthUser } from '../../../../../libs/decorator/auth-user.decorator'
import { UserDto } from './dto/user.dto'
import { UpdateUserResponseDto } from './dto/update-user-response.dto.st'
import { UpdateUserRequestDto } from './dto/update-user-request.dto.st'
import { RemoveUserResponseDto } from './dto/remove-user-response.dto.st'
import { jwtConstants } from '../../constants/jwt'
import { JwtService } from '@nestjs/jwt'

@Controller()
@ApiTags('users')
@ApiBearerAuth()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('users/:userId')
  @ApiOperation({
    summary: '유저 정보 조회',
  })
  @ApiOkResponse({
    type: FindOneUserResponseDto,
    description: '유저 정보 조회 성공',
  })
  @ApiResponse({
    status: 404,
    description: 'USER_NOTFOUND - 가입 되지 않은 사용자',
    schema: {
      example: {
        statusCode: 404,
        code: 'USER_NOTFOUND',
        message: '가입 되지 않은 사용자(id : 12345)',
      },
    },
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
    description: '회원 가입 성공',
  })
  @ApiResponse({
    status: 409,
    description: 'ALREADY_EXIST_USER_EXTERNAL_ID - 이미 가입된 사용자',
    schema: {
      example: {
        statusCode: 409,
        code: 'ALREADY_EXIST_USER_EXTERNAL_ID',
        message: '이미 가입된 사용자(id : 12345)',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'UNDERAGE_USER - 만 14세 미만은 가입할 수 없습니다.',
    schema: {
      example: {
        statusCode: 400,
        code: 'UNDERAGE_USER',
        message: '만 14세 미만은 가입할 수 없습니다.(나이 : 13)',
      },
    },
  })
  async createUser(
    @Headers('oAuth-token') oAuthToken: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    request: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    let externalId = null
    let authUser = null

    switch (request.provider?.toLowerCase()) {
      case 'google':
        authUser = await this.authService.getUserInfoForGoogle(oAuthToken)
        externalId = authUser.sub
        request.email = request.email ? request.email : authUser.email
        break
      case 'kakao':
        authUser = await this.authService.getUserInfoForKakao(oAuthToken)
        externalId = authUser.id
        request.email = request.email ? request.email : authUser.email
        break
      case 'apple':
        authUser = await this.authService.getUserInfoForApple(oAuthToken)
        externalId = authUser.sub
        request.email = request.email ? request.email : authUser.email
        break
      default:
        break
    }

    if (!externalId) {
      throw new HttpException(
        {
          code: 'NOT_EXIST_PROVIDER',
          status: HttpStatus.NOT_FOUND,
          message: `NOT_EXIST_PROVIDER(provider : ${request.provider})`,
        },
        HttpStatus.NOT_FOUND,
      )
    }

    const createdUser = await this.userService.createUser({ ...request, externalId: externalId })

    const payload = {
      id: createdUser.id,
    }
    const jwt = this.jwtService.sign(payload, { secret: jwtConstants.secret })

    return { jwt }
  }

  @UseGuards(JwtAuthGuard)
  @Put('users/:userId')
  @ApiOperation({
    summary: '유저 정보 업데이트',
  })
  @ApiOkResponse({
    type: UpdateUserResponseDto,
    description: '[ADMIN] 유저 정보 업데이트로 변경',
  })
  @ApiResponse({
    status: 404,
    description: 'USER_NOTFOUND - 가입 되지 않은 사용자',
    schema: {
      example: {
        statusCode: 404,
        code: 'USER_NOTFOUND',
        message: '가입 되지 않은 사용자(id : 12345)',
      },
    },
  })
  @Header('Content-Type', 'application/json')
  async updateUser(
    @Param('userId') userId: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    request: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto> {
    // ADMIN CHECK
    return this.userService.updateUser({ ...request, id: userId })
  }

  @UseGuards(JwtAuthGuard)
  @Delete('users/:userId')
  @ApiOperation({
    summary: '[ADMIN]유저 정보 삭제',
  })
  @ApiOkResponse({
    type: RemoveUserResponseDto,
    description: '유저 정보 삭제 성공',
  })
  @ApiResponse({
    status: 404,
    description: 'USER_NOTFOUND - 가입 되지 않은 사용자',
    schema: {
      example: {
        statusCode: 404,
        code: 'USER_NOTFOUND',
        message: '가입 되지 않은 사용자(id : 12345)',
      },
    },
  })
  @Header('Content-Type', 'application/json')
  async removeUser(@Param('userId') userId: string, @AuthUser() user: UserDto): Promise<RemoveUserResponseDto> {
    // ROLE GUARD 추가 필요
    return this.userService.removeUser({ id: userId })
  }

  @UseGuards(JwtAuthGuard)
  @Put('my/users')
  @ApiOperation({
    summary: '내 유저 정보 업데이트',
  })
  @ApiOkResponse({
    type: UpdateUserResponseDto,
    description: '유저 정보 업데이트 성공',
  })
  @ApiResponse({
    status: 404,
    description: 'USER_NOTFOUND - 가입 되지 않은 사용자',
    schema: {
      example: {
        statusCode: 404,
        code: 'USER_NOTFOUND',
        message: '가입 되지 않은 사용자(id : 12345)',
      },
    },
  })
  @Header('Content-Type', 'application/json')
  async updateMyUser(
    @AuthUser() user: UserDto,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    request: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto> {
    return this.userService.updateUser({ ...request, id: user.id })
  }

  @UseGuards(JwtAuthGuard)
  @Delete('my/users')
  @ApiOperation({
    summary: '회원 탈퇴',
  })
  @ApiOkResponse({
    type: RemoveUserResponseDto,
    description: '유저 정보 삭제 성공',
  })
  @ApiResponse({
    status: 404,
    description: 'USER_NOTFOUND - 가입 되지 않은 사용자',
    schema: {
      example: {
        statusCode: 404,
        code: 'USER_NOTFOUND',
        message: '가입 되지 않은 사용자(id : 12345)',
      },
    },
  })
  @Header('Content-Type', 'application/json')
  async removeMyUser(@AuthUser() user: UserDto): Promise<RemoveUserResponseDto> {
    return this.userService.removeUser({ id: user.id })
  }

  @UseGuards(JwtAuthGuard)
  @Get('my/profile')
  @ApiOperation({
    summary: '유저 정보 상세 조회',
    description: 'JWT 토큰 안에 들어 있는 유저 정보',
  })
  @ApiOkResponse({ type: FindOneUserResponseDto })
  async getProfile(@Request() request): Promise<FindOneUserResponseDto> {
    console.log(request.user.id)
    if (!request.user?.id) {
      return null
    }

    return this.userService.findOneUser({ id: request.user.id })
  }
}
