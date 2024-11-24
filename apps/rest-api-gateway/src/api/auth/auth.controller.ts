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

    const jwt = this.jwtService.sign(payload, { secret: jwtConstants.secret, expiresIn: '3d' })
    const refreshToken = this.jwtService.sign({ id: payload.id }, { secret: jwtConstants.secret, expiresIn: '30d' })

    return { jwt, refreshToken }
  }

  @Get('google')
  async googleLogin(@Headers('google-token') googleToken: string) {
    const googleUser = await this.authService.getUserInfoForGoogle(googleToken)

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

    const jwt = this.jwtService.sign(payload, { secret: jwtConstants.secret, expiresIn: '3d' })
    const refreshToken = this.jwtService.sign({ id: payload.id }, { secret: jwtConstants.secret, expiresIn: '30d' })

    //TODO Prod 배포하기전에 삭제

    return { jwt, refreshToken }
  }

  @Get('apple')
  async appleLogin(@Headers('apple-token') appleToken: string) {
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

    const jwt = this.jwtService.sign(payload, { secret: jwtConstants.secret, expiresIn: '3d' })
    const refreshToken = this.jwtService.sign({ id: payload.id }, { secret: jwtConstants.secret, expiresIn: '30d' })

    //TODO Prod 배포하기전에 삭제

    return { jwt, refreshToken }
  }

  @Get('/refresh')
  async jwtTokenRefresh(@Headers('Authorization') authorization: string) {
    const { id, exp } = this.jwtService.decode(authorization.replace('Bearer ', '').trim()) as {
      id: string
      iat: number
      exp: number
    }
    // 만료 시간이 지남
    if (new Date(exp * 1000) < new Date())
      throw new HttpException(
        {
          message: 'refresh token is expired',
        },
        HttpStatus.UNAUTHORIZED,
      )

    const user = await this.userService.findOneUser({ id })
    if (user == null)
      throw new HttpException(
        {
          message: 'user not found',
          code: 'USER_NOT_FOUND',
          status: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      )

    const payload = {
      id: user.id,
      externalId: user.externalId,
      role: user.role,
      nickName: user.nickName,
      profileUrl: user.profileUrl,
      email: user.email,
      birthDate: user.birthDate,
      createdAt: user.createdAt,
      statistics: user.statistics,
      provider: user.provider,
    }

    const jwt = this.jwtService.sign(payload, { secret: jwtConstants.secret, expiresIn: '3d' })
    const refreshToken = this.jwtService.sign({ id: payload.id }, { secret: jwtConstants.secret, expiresIn: '30d' })
    return {
      jwt,
      refreshToken,
    }
  }
}
