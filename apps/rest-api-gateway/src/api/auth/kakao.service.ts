import { Injectable } from '@nestjs/common'
import axios, { AxiosResponse } from 'axios'

@Injectable()
export class KakaoService {
  private readonly kakaoApiUrl = 'https://kapi.kakao.com/v2/user/me'

  constructor() {}

  async getUserInfo(kakaoToken: string): Promise<any> {
    try {
      const response: AxiosResponse = await axios.get(this.kakaoApiUrl, {
        headers: { Authorization: `Bearer ${kakaoToken}` },
      })
      return response.data
    } catch (error) {
      console.log({ methodName: 'getUserInfo', data: error, context: 'error' })

      throw new Error('Failed to fetch user info from Kakao')
    }
  }
}
