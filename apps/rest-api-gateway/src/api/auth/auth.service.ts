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
      const response = await axios.get('https://appleid.apple.com/auth/keys') // Apple의 공개 키 요청
      console.log('#####START#######')
      console.log(response)
      console.log('#####END########')
      // 이 부분에서 Apple의 JWT 토큰을 해석하여 사용자 정보 추출
      const userInfo = this.verifyAppleToken(appleToken, response.data) // 토큰 검증 및 사용자 정보 추출 함수
      return userInfo
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

  // Apple 토큰 검증 (JWT 해석)
  verifyAppleToken(token: string, applePublicKeys: any) {
    // Apple 공개 키를 사용하여 토큰 검증 후 사용자 정보 반환
    // JWT 토큰 파싱 및 검증 로직 추가 필요 (라이브러리 사용 가능)
  }
}
