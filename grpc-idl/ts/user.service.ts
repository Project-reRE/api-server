/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices'
import { Observable } from 'rxjs'
import { User } from './user'

export const protobufPackage = 'user.service'

export interface FindOneUserExternalIdRequest {
  externalId: string
}

export interface FindOneUserExternalIdResponse {
  user?: User | undefined
}

export interface FindOneUserRequest {
  id: string
}

export interface FindOneUserResponse {
  user?: User | undefined
}

export interface CreateUserRequest {
  externalId?: string | undefined
  nickName: string
  description?: string | undefined
  password?: string | undefined
  profileUrl?: string | undefined
  email?: string | undefined
  provider?: string | undefined
  role?: string | undefined
  gender?: boolean | undefined
  birthDate?: string | undefined
}

export interface CreateUserResponse {
  user?: User | undefined
}

export const USER_SERVICE_PACKAGE_NAME = 'user.service'

export interface UserServiceClient {
  findOneUserExternalId(request: FindOneUserExternalIdRequest, ...rest: any): Observable<FindOneUserExternalIdResponse>

  findOneUser(request: FindOneUserRequest, ...rest: any): Observable<FindOneUserResponse>

  createUser(request: CreateUserRequest, ...rest: any): Observable<CreateUserResponse>
}

export interface UserServiceController {
  findOneUserExternalId(
    request: FindOneUserExternalIdRequest,
    ...rest: any
  ): Promise<FindOneUserExternalIdResponse> | Observable<FindOneUserExternalIdResponse> | FindOneUserExternalIdResponse

  findOneUser(
    request: FindOneUserRequest,
    ...rest: any
  ): Promise<FindOneUserResponse> | Observable<FindOneUserResponse> | FindOneUserResponse

  createUser(
    request: CreateUserRequest,
    ...rest: any
  ): Promise<CreateUserResponse> | Observable<CreateUserResponse> | CreateUserResponse
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['findOneUserExternalId', 'findOneUser', 'createUser']
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method)
      GrpcMethod('UserService', method)(constructor.prototype[method], method, descriptor)
    }
    const grpcStreamMethods: string[] = []
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method)
      GrpcStreamMethod('UserService', method)(constructor.prototype[method], method, descriptor)
    }
  }
}

export const USER_SERVICE_NAME = 'UserService'
