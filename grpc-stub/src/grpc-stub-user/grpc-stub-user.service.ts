import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc, RpcException } from '@nestjs/microservices'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import {
  CreateUserRequest,
  CreateUserResponse,
  FindOneUserExternalIdRequest,
  FindOneUserExternalIdResponse,
  FindOneUserRequest,
  FindOneUserResponse,
  USER_SERVICE_NAME,
  UserServiceClient,
} from '@grpc-idl/proto/user.service'

@Injectable()
export class GrpcStubUserService implements UserServiceClient {
  private grpcStubUserService: UserServiceClient

  constructor(@Inject('GRPC_STUB_USER') private client: ClientGrpc) {
    this.grpcStubUserService = this.client.getService<UserServiceClient>(USER_SERVICE_NAME)
  }

  findOneUserExternalId(request: FindOneUserExternalIdRequest): Observable<FindOneUserExternalIdResponse> {
    return this.grpcStubUserService
      .findOneUserExternalId(request)
      .pipe(catchError((e) => throwError(() => new RpcException(e))))
  }

  findOneUser(request: FindOneUserRequest): Observable<FindOneUserResponse> {
    return this.grpcStubUserService.findOneUser(request).pipe(catchError((e) => throwError(() => new RpcException(e))))
  }

  createUser(request: CreateUserRequest): Observable<CreateUserResponse> {
    return this.grpcStubUserService.createUser(request).pipe(catchError((e) => throwError(() => new RpcException(e))))
  }
}
