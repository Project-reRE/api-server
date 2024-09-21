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

      // Apple의 Public Key로 서명 검증
      const appleKeys = await this.getApplePublicKeys()
      const key = appleKeys.keys.find((k) => k.kid === decodedToken.header.kid)

      if (!key) {
        throw new HttpException(
          {
            code: 'INVALID_APPLE_TOKEN',
            status: HttpStatus.UNAUTHORIZED,
            message: 'Apple token verification failed',
          },
          HttpStatus.UNAUTHORIZED,
        )
      }

      // JWT 서명 검증
      const publicKey = this.getPublicKeyFromJwk(key)
      const verifiedToken = jwt.verify(appleToken, publicKey, { algorithms: ['RS256'] })

      return verifiedToken
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

  // Apple Public Keys 가져오기
  async getApplePublicKeys(): Promise<any> {
    const response = await axios.get('https://appleid.apple.com/auth/keys')
    return response.data
  }

  // JWK에서 Public Key 추출하기
  getPublicKeyFromJwk(jwk): string {
    // RSA Public Key로 변환
    const { e, n } = jwk
    const exponent = Buffer.from(e, 'base64')
    const modulus = Buffer.from(n, 'base64')
    return `-----BEGIN PUBLIC KEY-----\n${modulus}\n${exponent}\n-----END PUBLIC KEY-----`
  }
}
