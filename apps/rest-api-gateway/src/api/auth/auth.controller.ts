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
    const kakaoUser = await this.authService.getUserInfoForKakao(kakaoToken)

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
    const emailCheck = await this.userService.findUserByEmail(kakaoUser.email)

    if (emailCheck.externalId !== kakaoUser.id) {
      throw new HttpException(
        {
          code: 'ALREDY_EXIST_EMAIL',
          status: HttpStatus.CONFLICT,
          message: 'already registered email in another platform',
        },
        HttpStatus.CONFLICT,
      )
    }

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

    const jwt = this.jwtService.sign(payload, { secret: jwtConstants.secret })

    //TODO Prod 배포하기전에 삭제
    console.log(jwt, 'kakao')

    return { jwt }
  }

  @Get('google')
  async googleLogin(@Headers('google-token') googleToken: string) {
    const googleUser = await this.authService.getUserInfoForGoogle(googleToken)

    const existUser = await this.userService.findOneUserExternal({ externalId: googleUser.sub }).catch((e) => {
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

    const emailCheck = await this.userService.findUserByEmail(googleUser.email)

    if (emailCheck.externalId !== googleUser.sub) {
      throw new HttpException(
        {
          code: 'ALREDY_EXIST_EMAIL',
          status: HttpStatus.CONFLICT,
          message: 'already registered email in another platform',
        },
        HttpStatus.CONFLICT,
      )
    }
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

    const jwt = this.jwtService.sign(payload, { secret: jwtConstants.secret })

    //TODO Prod 배포하기전에 삭제
    console.log(jwt, 'goggle')

    return { jwt }
  }

  @Get('apple')
  async appleLogin(@Headers('apple-token') appleToken: string) {
    // Apple 토큰으로 사용자 정보 가져오기
    const appleUser = await this.authService.getUserInfoForApple(appleToken)

    // DB에서 사용자가 존재하는지 확인
    const existUser = await this.userService.findOneUserExternal({ externalId: appleUser.sub }).catch((e) => {
      if (e.response.code) {
        throw new HttpException(
          {
            code: 'NOT_YET_RERE_USER',
            status: HttpStatus.NOT_FOUND,
            message: 'not yet rere user',
          },
          HttpStatus.NOT_FOUND,
        )
      } else {
        throw new HttpException(
          {
            code: 'UNKNOWN_ERROR',
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'INTERNAL_SERVER_ERROR',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        )
      }
    })
    const emailCheck = await this.userService.findUserByEmail('appleUser')

    if (emailCheck.externalId !== appleUser.id) {
      throw new HttpException(
        {
          code: 'ALREDY_EXIST_EMAIL',
          status: HttpStatus.CONFLICT,
          message: 'already registered email in another platform',
        },
        HttpStatus.CONFLICT,
      )
    }

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

    const jwt = this.jwtService.sign(payload, { secret: jwtConstants.secret })

    //TODO Prod 배포하기전에 삭제
    console.log(jwt, 'apple')

    return { jwt }
  }
}
