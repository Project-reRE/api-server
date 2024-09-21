import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import axios from 'axios'
import * as jwt from 'jsonwebtoken'

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

  async getUserInfoForGoogle(googleToken: string): Promise<any> {
    try {
      const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${googleToken}`,
        },
      })
      return response.data
    } catch (error) {
      throw new HttpException(
        {
          code: 'INVALID_GOOGLE_TOKEN',
          status: HttpStatus.UNAUTHORIZED,
          message: 'Invalid Google token',
        },
        HttpStatus.UNAUTHORIZED,
      )
    }
  }

  async getUserInfoForApple(appleToken: string): Promise<any> {
    try {
      // Apple의 Public Key를 사용해 Apple Token(JWT) 검증
      const decodedToken: any = jwt.decode(appleToken, { complete: true })

      if (!decodedToken) {
        throw new HttpException(
          {
            code: 'INVALID_APPLE_TOKEN',
            status: HttpStatus.UNAUTHORIZED,
            message: 'Invalid Apple token',
          },
          HttpStatus.UNAUTHORIZED,
        )
      }

      return decodedToken.payload
    } catch (error) {
      throw new HttpException(
        {
          code: 'INVALID_APPLE_TOKEN',
          status: HttpStatus.UNAUTHORIZED,
          message: 'Invalid Apple token',
        },
        HttpStatus.UNAUTHORIZED,
      )
    }
  }
}
