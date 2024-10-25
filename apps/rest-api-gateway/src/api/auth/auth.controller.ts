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
    // console.log({ methodName: 'kakaoLogin', data: kakaoToken, context: 'kakaoToken' })
    const kakaoUser = await this.authService.getUserInfoForKakao(kakaoToken)

    // console.log({ methodName: 'kakaoLogin', data: kakaoUser, context: 'kakaoUser' })

    const isAlreadyRegisterEmail = await this.userService.isAlreadyEmailUsedOtherPlatform(
      kakaoUser.id,
      kakaoUser.kakao_account.email,
    )

    if (isAlreadyRegisterEmail)
      throw new HttpException(
        {
          code: 'ALREADY_REGISTERED_USER_BY_EMAIL',
          status: HttpStatus.CONFLICT,
          message: `already registered user by email`,
        },
        HttpStatus.CONFLICT,
      )

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

    // console.log({ methodName: 'kakaoLogin', data: existUser, context: 'existUser' })

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

    // console.log({ methodName: 'kakaoLogin', data: payload, context: 'payload' })
    const jwt = this.jwtService.sign(payload, { secret: jwtConstants.secret })

    // console.log({ methodName: 'kakaoLogin', data: jwt, context: 'jwt' })

    //TODO Prod 배포하기전에 삭제
    console.log(jwt, 'kakao')

    return { jwt }
  }

  @Get('google')
  async googleLogin(@Headers('google-token') googleToken: string) {
    // console.log({ methodName: 'googleLogin', data: googleToken, context: 'googleToken' })
    const googleUser = await this.authService.getUserInfoForGoogle(googleToken)

    // console.log({ methodName: 'googleLogin', data: googleUser, context: 'googleUser' })
    const isAlreadyRegisterEmail = await this.userService.isAlreadyEmailUsedOtherPlatform(
      googleUser.sub,
      googleUser.email,
    )
    if (isAlreadyRegisterEmail)
      throw new HttpException(
        {
          code: 'ALREADY_REGISTERED_USER_BY_EMAIL',
          status: HttpStatus.CONFLICT,
          message: `already registered user by email`,
        },
        HttpStatus.CONFLICT,
      )

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
    // console.log({ methodName: 'appleLogin', data: appleToken, context: 'appleToken' })

    // Apple 토큰으로 사용자 정보 가져오기
    const appleUser = await this.authService.getUserInfoForApple(appleToken)

    const isAlreadyRegisterEmail = await this.userService.isAlreadyEmailUsedOtherPlatform(
      appleUser.sub,
      appleUser.email,
    )
    if (isAlreadyRegisterEmail)
      throw new HttpException(
        {
          code: 'ALREADY_REGISTERED_USER_BY_EMAIL',
          status: HttpStatus.CONFLICT,
          message: `already registered user by email`,
        },
        HttpStatus.CONFLICT,
      )

    // console.log({ methodName: 'appleLogin', data: appleUser, context: 'appleUser' })

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
