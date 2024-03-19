import { Inject, Injectable } from '@nestjs/common'
import {
  CreateUserRequest,
  CreateUserResponse,
  FindOneUserRequest,
  FindOneUserResponse,
  USER_SERVICE_NAME,
  UserServiceClient,
} from '@grpc-idl/proto/user'
import { ClientGrpc, RpcException } from '@nestjs/microservices'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { Metadata } from '@grpc/grpc-js'

@Injectable()
export class GrpcStubUserService implements UserServiceClient {
  private grpcStubUserService: UserServiceClient

  constructor(@Inject('GRPC_STUB_USER') private client: ClientGrpc) {
    this.grpcStubUserService = this.client.getService<UserServiceClient>(USER_SERVICE_NAME)
  }

  findOne(request: FindOneUserRequest): Observable<FindOneUserResponse> {
    return this.grpcStubUserService.findOne(request).pipe(catchError((e) => throwError(() => new RpcException(e))))
  }

  create(request: CreateUserRequest): Observable<CreateUserResponse> {
    return this.grpcStubUserService.create(request).pipe(catchError((e) => throwError(() => new RpcException(e))))
  }
}
