import { Controller, Get, Headers, HttpException, HttpStatus } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { UserService } from '../user/user.service'
import { AuthService } from './auth.service'
import { jwtConstants } from '../../constants/jwt'

@Controller('auth')
@ApiTags('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private userService: UserService,
  ) {}

  @Get('kakao')
  async kakaoLogin(@Headers('kakao-token') kakaoToken: string) {
    console.log({ methodName: 'kakaoLogin', data: kakaoToken, context: 'kakaoToken' })
    const kakaoUser = await this.authService.getUserInfoForKakao(kakaoToken)

    console.log({ methodName: 'kakaoLogin', data: kakaoUser, context: 'kakaoUser' })

    const existUser = await this.userService.findOneUserExternal({ externalId: kakaoUser.id }).catch((e) => {
      if (e.response.code) {
        throw new HttpException(
          {
            code: 'NOT_YET_RERE_USER',
            status: HttpStatus.NOT_FOUND,
            message: `not yet rere user`,
          },
          HttpStatus.NOT_FOUND,
        )
      } else {
        throw new HttpException(
          {
            code: 'UNKNOWN_ERROR',
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: `INTERNAL_SERVER_ERROR`,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        )
      }
    })

    console.log({ methodName: 'kakaoLogin', data: existUser, context: 'existUser' })

    const payload = {
      id: existUser.id,
      externalId: existUser.externalId,
      role: existUser.role,
      nickName: existUser.nickName,
      profileUrl: existUser.profileUrl,
      email: existUser.email,
      birthDate: existUser.birthDate,
      createdAt: existUser.createdAt,
      statistics: existUser.statistics,
      provider: existUser.provider,
    }

    console.log({ methodName: 'kakaoLogin', data: payload, context: 'payload' })
    const jwt = this.jwtService.sign(payload, { secret: jwtConstants.secret })

    console.log({ methodName: 'kakaoLogin', data: jwt, context: 'jwt' })

    return { jwt }
  }
}
