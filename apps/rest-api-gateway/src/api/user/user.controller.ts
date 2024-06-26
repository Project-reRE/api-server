import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { GrpcStubUserService } from '@grpc-stub/grpc-stub-user'
import { firstValueFrom } from 'rxjs'
import { CreateUserRequestDto } from './dto/create-user-request.dto.st'
import { CreateUserResponseDto } from './dto/create-user-response.dto'
import { plainToInstance } from 'class-transformer'
import { FindOneUserResponseDto } from './dto/find-one-user-response.dto'
import { ApiTags } from '@nestjs/swagger'

@Controller()
@ApiTags('users')
export class UserController {
  constructor(private readonly grpcStubUserService: GrpcStubUserService) {}

  @Get('/users/:userId')
  async findOne(@Param('userId') userId: string): Promise<FindOneUserResponseDto> {
    console.log({ methodName: 'findOne', data: userId, context: 'userId' })

    const { user: existUser } = await firstValueFrom(this.grpcStubUserService.findOneUser({ id: userId }))

    console.log({ methodName: 'findOne', data: existUser, context: 'existUser' })

    return plainToInstance(FindOneUserResponseDto, existUser)
  }

  @Post('/users')
  async createUser(@Body() request: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    console.log({ methodName: 'createUser', data: request, context: 'request' })
    const { user: createdUser } = await firstValueFrom(this.grpcStubUserService.createUser(request))

    console.log({ methodName: 'createUser', data: createdUser, context: 'createdUser' })

    return plainToInstance(CreateUserResponseDto, createdUser)
  }
}
