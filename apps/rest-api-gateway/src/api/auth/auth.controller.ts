import { Controller, Get, Headers, HttpException, HttpStatus } from '@nestjs/common'
import { KakaoService } from './kakao.service'
import { JwtService } from '@nestjs/jwt'
import { GrpcStubUserService } from '@grpc-stub/grpc-stub-user'
import { ApiTags } from '@nestjs/swagger'
import { firstValueFrom } from 'rxjs'

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly kakaoService: KakaoService,
    private readonly jwtService: JwtService,
    private readonly grpcStubUserService: GrpcStubUserService,
  ) {}

  @Get('kakao')
  async kakaoLogin(@Headers('kakao-token') kakaoToken: string) {
    console.log({ methodName: 'kakaoLogin', data: kakaoToken, context: 'kakaoToken' })
    const kakaoUser = await this.kakaoService.getUserInfo(kakaoToken)

    console.log({ methodName: 'kakaoLogin', data: kakaoUser, context: 'kakaoUser' })

    let { user: existUser } = await firstValueFrom(
      this.grpcStubUserService.findOneUserExternalId({ externalId: kakaoUser.id }),
    )

    console.log({ methodName: 'kakaoLogin', data: existUser, context: 'existUser' })

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
    const jwt = this.jwtService.sign(payload)

    console.log({ methodName: 'kakaoLogin', data: jwt, context: 'jwt' })

    return { jwt }
  }
}
