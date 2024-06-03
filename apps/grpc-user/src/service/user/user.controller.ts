import { Controller, UseFilters } from '@nestjs/common'
import { UserService } from './user.service'

import {
  CreateUserRequest,
  CreateUserResponse,
  FindOneUserExternalIdRequest,
  FindOneUserRequest,
  FindOneUserResponse,
  UserServiceController,
  UserServiceControllerMethods,
} from '@grpc-idl/proto/user.service'
import { AllExceptionsFilter } from '../../../../../libs/filter/allExceptionsFilter'

@Controller('user')
@UseFilters(AllExceptionsFilter)
@UserServiceControllerMethods()
export class UserController implements UserServiceController {
  constructor(private readonly userService: UserService) {}

  findOneUserExternalId(request: FindOneUserExternalIdRequest): Promise<FindOneUserResponse> {
    return this.userService.findOneUserExternal(request)
  }

  findOneUser(request: FindOneUserRequest): Promise<FindOneUserResponse> {
    return this.userService.findOneUser(request)
  }

  createUser(request: CreateUserRequest): Promise<CreateUserResponse> {
    return this.userService.createUser(request)
  }
}
