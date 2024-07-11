import { Controller, Get, Headers, HttpException, HttpStatus } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ApiTags } from '@nestjs/swagger'
import { UserService } from '../user/user.service'
import { AuthService } from './auth.service'

@Controller('auth')
@ApiTags('auth')
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

    let { user: existUser } = await this.userService.findOneUserExternal({ externalId: kakaoUser.id })

    await console.log({ methodName: 'kakaoLogin', data: existUser, context: 'existUser' })

    if (!existUser) {
      throw new HttpException(
        {
          code: 'NOT_YET_RERE_USER',
          status: HttpStatus.NOT_FOUND,
          message: `not yet rere user`,
        },
        HttpStatus.NOT_FOUND,
      )
    }

    const payload = { externalId: existUser.externalId, role: existUser.role, id: existUser.id }

    console.log({ methodName: 'kakaoLogin', data: payload, context: 'payload' })
    const jwt = this.jwtService.sign(payload, { secret: process.env.JWT_SECRET_KEY })

    console.log({ methodName: 'kakaoLogin', data: jwt, context: 'jwt' })

    return { jwt }
  }
}
