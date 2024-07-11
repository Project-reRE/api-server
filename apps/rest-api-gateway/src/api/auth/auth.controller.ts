import { Controller, Get, Headers, HttpException, HttpStatus } from '@nestjs/common'
import { KakaoService } from './kakao.service'
import { JwtService } from '@nestjs/jwt'
import { ApiTags } from '@nestjs/swagger'
import { UserService } from '../user/user.service'

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly kakaoService: KakaoService,
    private readonly jwtService: JwtService,
    private userService: UserService,
  ) {}

  @Get('kakao')
  async kakaoLogin(@Headers('kakao-token') kakaoToken: string) {
    console.log({ methodName: 'kakaoLogin', data: kakaoToken, context: 'kakaoToken' })
    const kakaoUser = await this.kakaoService.getUserInfo(kakaoToken)

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

  @Get('kakao/401')
  async kakaoLoginTest401(@Headers('kakao-token') kakaoToken: string) {
    console.log({ methodName: 'kakaoLogin', data: kakaoToken, context: 'kakaoToken' })
    const kakaoUser = await this.kakaoService.getUserInfo(kakaoToken)

    console.log({ methodName: 'kakaoLogin', data: kakaoUser, context: 'kakaoUser' })

    throw new HttpException(
      {
        code: 'KAKAO_TOKEN_NOT_VERIFYED',
        status: HttpStatus.UNAUTHORIZED,
        message: `Request failed with status code 401`,
      },
      HttpStatus.UNAUTHORIZED,
    )
    //
    // let { user: existUser } = await firstValueFrom(
    //   this.grpcStubUserService.findOneUserExternalId({ externalId: kakaoUser.id }),
    // )
    //
    // console.log({ methodName: 'kakaoLogin', data: existUser, context: 'existUser' })
    //
    // if (!existUser) {
    //   throw new HttpException(
    //     {
    //       code: 'NOT_YET_RERE_USER',
    //       status: HttpStatus.NOT_FOUND,
    //       message: `not yet rere user`,
    //     },
    //     HttpStatus.NOT_FOUND,
    //   )
    // }
    //
    // const payload = { externalId: existUser.externalId, role: existUser.role, id: existUser.id }
    //
    // console.log({ methodName: 'kakaoLogin', data: payload, context: 'payload' })
    // const jwt = this.jwtService.sign(payload, { secret: process.env.JWT_SECRET_KEY })
    //
    // console.log({ methodName: 'kakaoLogin', data: jwt, context: 'jwt' })

    return null
  }

  @Get('kakao/404')
  async kakaoLoginTest404(@Headers('kakao-token') kakaoToken: string) {
    console.log({ methodName: 'kakaoLogin', data: kakaoToken, context: 'kakaoToken' })

    throw new HttpException(
      {
        code: 'NOT_YET_RERE_USER',
        status: HttpStatus.NOT_FOUND,
        message: `not yet rere user`,
      },
      HttpStatus.NOT_FOUND,
    )
    //
    // const kakaoUser = await this.kakaoService.getUserInfo(kakaoToken)
    //
    // // console.log({ methodName: 'kakaoLogin', data: kakaoUser, context: 'kakaoUser' })
    // //
    // // let { user: existUser } = await firstValueFrom(
    // //   this.grpcStubUserService.findOneUserExternalId({ externalId: kakaoUser.id }),
    // // )
    // //
    // // console.log({ methodName: 'kakaoLogin', data: existUser, context: 'existUser' })
    //
    // if (!existUser) {
    //
    // }
    //
    // const payload = { externalId: existUser.externalId, role: existUser.role, id: existUser.id }
    //
    // console.log({ methodName: 'kakaoLogin', data: payload, context: 'payload' })
    // const jwt = this.jwtService.sign(payload, { secret: process.env.JWT_SECRET_KEY })
    //
    // console.log({ methodName: 'kakaoLogin', data: jwt, context: 'jwt' })

    return null
  }

  @Get('kakao/200')
  async kakaoLoginTest201(@Headers('kakao-token') kakaoToken: string) {
    console.log({ methodName: 'kakaoLogin', data: kakaoToken, context: 'kakaoToken' })
    // const kakaoUser = await this.kakaoService.getUserInfo(kakaoToken)
    //
    // console.log({ methodName: 'kakaoLogin', data: kakaoUser, context: 'kakaoUser' })
    //
    // let { user: existUser } = await firstValueFrom(
    //   this.grpcStubUserService.findOneUserExternalId({ externalId: kakaoUser.id }),
    // )
    //
    // console.log({ methodName: 'kakaoLogin', data: existUser, context: 'existUser' })
    //
    // if (!existUser) {
    //   throw new HttpException(
    //     {
    //       code: 'NOT_YET_RERE_USER',
    //       status: HttpStatus.NOT_FOUND,
    //       message: `not yet rere user`,
    //     },
    //     HttpStatus.NOT_FOUND,
    //   )
    // }

    const payload = { externalId: 'kakao_201TESTUSER', role: 'USER', id: '1' }

    console.log({ methodName: 'kakaoLogin', data: payload, context: 'payload' })
    const jwt = this.jwtService.sign(payload, { secret: process.env.JWT_SECRET_KEY })

    console.log({ methodName: 'kakaoLogin', data: jwt, context: 'jwt' })

    return { jwt }
  }
}
