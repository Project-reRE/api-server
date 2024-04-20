import { Body, Controller, Get, Param, Post, UseFilters } from '@nestjs/common'
import { GrpcStubUserService } from '@grpc-stub/grpc-stub-user'
import { CreateUserRequest, CreateUserResponse, FindOneUserResponse } from '@grpc-idl/proto/user'
import { firstValueFrom } from 'rxjs'
import { AllExceptionsFilter } from '../../../../../libs/filter/allExceptionsFilter'

@Controller()
@UseFilters(AllExceptionsFilter)
export class UserController {
  constructor(private readonly grpcStubUserService: GrpcStubUserService) {}

  @Get('/users/:userId')
  async findOne(@Param('userId') userId: string): Promise<FindOneUserResponse> {
    const existUser = await firstValueFrom(this.grpcStubUserService.findOne({ id: userId }))

    console.log(existUser)

    return existUser
  }

  @Post('/users')
  async create(@Body() createUserRequestDto: CreateUserRequest): Promise<CreateUserResponse> {
    const createdUser = await firstValueFrom(this.grpcStubUserService.create(createUserRequestDto))

    console.log(createdUser)

    return createdUser
  }
}
