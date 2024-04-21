/* eslint-disable */
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
  externalId?: string | undefined;
  nickName: string;
  description?: string | undefined;
  password: string;
  profileUrl?: string | undefined;
  email: string;
  provider?: string | undefined;
  role?: string | undefined;
  gender: boolean;
  birthDate: string;
}

export interface CreateUserResponse {
  user?: User | undefined;
}

export interface User {
  id: string;
  externalId: string;
  nickName: string;
  description?: string | undefined;
  profileUrl?: string | undefined;
  email: string;
  provider: string;
  role: string;
  gender: boolean;
  birthDate: string;
  createdDate: string;
  updatedDate: string;
  deletedDate?: string | undefined;
}

export const USER_PACKAGE_NAME = "user";

export interface UserServiceClient {
  findOne(request: FindOneUserRequest, ...rest: any): Observable<FindOneUserResponse>;

  create(request: CreateUserRequest, ...rest: any): Observable<CreateUserResponse>;
}

export interface UserServiceController {
  findOne(
    request: FindOneUserRequest,
    ...rest: any
  ): Promise<FindOneUserResponse> | Observable<FindOneUserResponse> | FindOneUserResponse;

  create(
    request: CreateUserRequest,
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
