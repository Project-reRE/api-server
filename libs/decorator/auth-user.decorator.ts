import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { UserDto } from '../../apps/rest-api-gateway/src/api/user/dto/user.dto'

export const AuthUser = createParamDecorator(async (data: string, context: ExecutionContext): Promise<UserDto> => {
  switch (context.getType()) {
    case 'http':
      const request = context.switchToHttp().getRequest()
      return data ? request.user?.[data] : request.user
    case 'ws':
      const wsRequest = context.switchToWs().getClient()
      return data ? wsRequest?.user?.[data] : wsRequest.user

    default:
      return undefined
  }
})
