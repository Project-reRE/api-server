import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import axios from 'axios'

@Injectable()
export class AuthService {
  private readonly kakaoApiUrl = 'https://kapi.kakao.com/v2/user/me'

  constructor(private jwtService: JwtService) {}

  async getUserInfoForKakao(kakaoToken: string): Promise<any> {
    try {
      const response = await axios.get(this.kakaoApiUrl, {
        headers: { Authorization: `Bearer ${kakaoToken}` },
      })
      return response.data
    } catch (error) {
      console.log({ methodName: 'getUserInfo', data: error, context: 'error' })

      throw new HttpException(
        {
          code: 'KAKAO_TOKEN_NOT_VERIFYED',
          status: HttpStatus.UNAUTHORIZED,
          message: `Request failed with status code 401`,
        },
        HttpStatus.UNAUTHORIZED,
      )
    }
  }
}
