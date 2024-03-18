/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "user";

export interface FindOneUserRequest {
  id: string;
}

export interface FindOneUserResponse {
  user?: User | undefined;
}

export interface CreateUserRequest {
  username: string;
}

export interface CreateUserResponse {
  user?: User | undefined;
}

export interface User {
  id: string;
  username: string;
}

export const USER_PACKAGE_NAME = "user";

export interface UserServiceClient {
  findOne(request: FindOneUserRequest, metadata: Metadata, ...rest: any): Observable<FindOneUserResponse>;

  create(request: CreateUserRequest, metadata: Metadata, ...rest: any): Observable<CreateUserResponse>;
}

export interface UserServiceController {
  findOne(
    request: FindOneUserRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<FindOneUserResponse> | Observable<FindOneUserResponse> | FindOneUserResponse;

  create(
    request: CreateUserRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<CreateUserResponse> | Observable<CreateUserResponse> | CreateUserResponse;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["findOne", "create"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USER_SERVICE_NAME = "UserService";
