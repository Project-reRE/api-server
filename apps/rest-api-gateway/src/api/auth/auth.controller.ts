import { Controller, Get, Headers } from '@nestjs/common'
import { KakaoService } from './kakao.service'
import { JwtService } from '@nestjs/jwt'
import { GrpcStubUserService } from '@grpc-stub/grpc-stub-user'
import { firstValueFrom } from 'rxjs'
import { ApiTags } from '@nestjs/swagger'

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
    const kakaoUser = await this.kakaoService.getUserInfo(kakaoToken)

    let { user: existUser } = await firstValueFrom(
      this.grpcStubUserService.findOneUserExternalId({ externalId: kakaoUser.id }),
    )

    if (!existUser) {
      const { user: createdUser } = await firstValueFrom(
        this.grpcStubUserService.createUser({ externalId: kakaoUser.id, nickName: kakaoUser.properties.nickname }),
      )

      existUser = createdUser
    }

    const payload = { externalId: existUser.externalId, role: existUser.role, id: existUser.id }
    const jwt = this.jwtService.sign(payload)

    return { jwt }
  }
}
