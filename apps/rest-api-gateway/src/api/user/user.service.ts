import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '../../entity/user.entity'
import { FindOneUserExternalIdRequest, FindOneUserRequest } from '@grpc-idl/proto/user.service'
import { status as GrpcStatus } from '@grpc/grpc-js'
import { CreateUserRequestDto } from './dto/create-user-request.dto.st'
import { FindOneUserResponseDto } from './dto/find-one-user-response.dto'
import { CreateUserResponseDto } from './dto/create-user-response.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findOneUserExternal(request: FindOneUserExternalIdRequest): Promise<FindOneUserResponseDto> {
    console.log(request, 'findOneUserExternal')
    const existUserEntity = await this.userRepository.findOne({ where: { externalId: request.externalId } })

    if (!existUserEntity) {
      throw new HttpException(
        {
          code: 'USER_NOTFOUND',
          status: GrpcStatus.NOT_FOUND,
          message: `User with ExternalId ${request.externalId} not found`,
        },
        HttpStatus.NOT_FOUND,
      )
    }

    return Object.assign(existUserEntity)
  }

  async findOneUser(request: FindOneUserRequest): Promise<FindOneUserResponseDto> {
    console.log(request, 'findOneUser')
    const existUserEntity = await this.userRepository.findOne({ where: { id: request.id } })
    if (!existUserEntity) {
      throw new HttpException(
        {
          code: 'USER_NOTFOUND',
          status: GrpcStatus.NOT_FOUND,
          message: `User with ID ${request.id} not found`,
        },
        HttpStatus.NOT_FOUND,
      )
    }

    return Object.assign(existUserEntity)
  }

  async createUser(request: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    console.log(request, 'createUser')

    const existUserEntity = await this.userRepository.findOne({ where: { externalId: request.externalId } })

    if (existUserEntity) {
      throw new HttpException(
        {
          code: 'ALREADY_EXIST_USER_EXTERNAL_ID',
          status: HttpStatus.CONFLICT,
          message: `이미 가입된 사용자(id : ${existUserEntity.id})`,
        },
        HttpStatus.CONFLICT,
      )
    }

    const creatableUser = this.userRepository.create(request)

    creatableUser.nickName = `tester_${new Date().getTime()}`

    const createdUser = await this.userRepository.save(creatableUser)

    console.log(createdUser, 'createUser', 'createdUser')

    return Object.assign(createdUser)
  }
}
