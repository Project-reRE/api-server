import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common'
import { Payload } from '@nestjs/microservices'
import { UsersService } from './users.service'
import { CreateUserRequestDto } from '../../dto/create-user-request.dto'
import { CreateUserResponseDto } from '../../dto/create-user-response.dto'
import { FindUsersResponseDto } from '../../dto/find-users-response.dto'
import { FindOneUserResponseDto } from '../../dto/find-one-user-response.dto'
import { UpdateUserRequestDto } from '../../dto/update-user-request.dto'
import { UpdateUserResponseDto } from '../../dto/update-user-response.dto'
import { RemoveUserResponseDto } from '../../dto/remove-user-response.dto'

@Controller('')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/users')
  async createUser(@Payload() createUserDto: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    return await this.usersService.createUser(createUserDto)
  }

  @Get('/users')
  async findUsers(): Promise<FindUsersResponseDto> {
    return await this.usersService.findUsers()
  }

  @Get('/:userId')
  async findOneUser(@Payload() userId: number): Promise<FindOneUserResponseDto> {
    return await this.usersService.findOneUser(userId)
  }

  @Put('/:userId')
  async updateUser(@Payload() userId: number, @Body() request: UpdateUserRequestDto): Promise<UpdateUserResponseDto> {
    return await this.usersService.updateUser(userId, request)
  }

  @Delete('/:userId')
  async removeUser(@Payload() userId: number): Promise<RemoveUserResponseDto> {
    return await this.usersService.removeUser(userId)
  }
}
