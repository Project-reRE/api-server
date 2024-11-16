import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers['authorization']

    // Authorization 헤더가 없으면 요청을 통과시킴
    if (!authHeader) {
      return true
    }

    return super.canActivate(context)
  }

  handleRequest(err, user, info, context) {
    // 인증 실패 시에도 에러를 던지지 않고 null을 반환
    if (err || !user) {
      return null
    }
    return user
  }
}
