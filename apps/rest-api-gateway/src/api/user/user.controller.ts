import { Body, Controller, Get, Param, Post, UseFilters } from '@nestjs/common'
import { GrpcStubUserService } from '@grpc-stub/grpc-stub-user'
import { CreateUserResponse, FindOneUserResponse } from '@grpc-idl/proto/user'
import { firstValueFrom } from 'rxjs'
import { AllExceptionsFilter } from '../../../../../libs/filter/allExceptionsFilter'
import { CreateUserRequestDto } from './dto/create-user-request.dto.st'
import { CreateUserResponseDto } from './dto/create-user-response.dto'
import { plainToInstance } from 'class-transformer'
import { FindOneUserResponseDto } from './dto/find-one-user-response.dto'

@Controller()
@UseFilters(AllExceptionsFilter)
export class UserController {
  constructor(private readonly grpcStubUserService: GrpcStubUserService) {}

  @Get('/users/:userId')
  async findOne(@Param('userId') userId: string): Promise<FindOneUserResponseDto> {
    const { user } = await firstValueFrom(this.grpcStubUserService.findOne({ id: userId }))

    console.log(user)

    return plainToInstance(FindOneUserResponseDto, user)
  }

  @Post('/users')
  async create(@Body() request: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    console.log(request, 'createUser')
    const createdUser = await firstValueFrom(this.grpcStubUserService.create(request))
    console.log('HERE')
    console.log(createdUser)

    return plainToInstance(CreateUserResponseDto, createdUser)
  }
}
