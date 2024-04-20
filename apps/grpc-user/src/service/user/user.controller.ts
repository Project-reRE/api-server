import { Controller, UseFilters } from '@nestjs/common'
import { Metadata } from '@grpc/grpc-js'
import { UserService } from './user.service'

import {
  CreateUserRequest,
  CreateUserResponse,
  FindOneUserRequest,
  FindOneUserResponse,
  UserServiceController,
  UserServiceControllerMethods,
} from '@grpc-idl/proto/user'
import { AllExceptionsFilter } from '../../../../../libs/filter/allExceptionsFilter'

@Controller('user')
@UseFilters(AllExceptionsFilter)
@UserServiceControllerMethods()
export class UserController implements UserServiceController {
  constructor(private readonly userService: UserService) {}

  findOne(request: FindOneUserRequest, metadata: Metadata, ...rest): Promise<FindOneUserResponse> {
    return this.userService.findOneUser(request)
  }

  create(request: CreateUserRequest, metadata: Metadata, ...rest): Promise<CreateUserResponse> {
    return this.userService.createUser(request)
  }
}
