import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '../../entity/user.entity'
import {
  CreateUserRequest,
  CreateUserResponse,
  FindOneUserExternalIdRequest,
  FindOneUserExternalIdResponse,
  FindOneUserRequest,
  FindOneUserResponse,
} from '@grpc-idl/proto/user.service'
import { serialize } from 'class-transformer'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findOneUserExternal(request: FindOneUserExternalIdRequest): Promise<FindOneUserExternalIdResponse> {
    console.log(request, 'findOneUserExternal')
    const existUserEntity = await this.userRepository.findOne({ where: { externalId: request.externalId } })

    return { user: JSON.parse(serialize(existUserEntity)) }
  }

  async findOneUser(request: FindOneUserRequest): Promise<FindOneUserResponse> {
    console.log(request, 'findOneUser')
    const existUserEntity = await this.userRepository.findOne({ where: { id: request.id } })

    return { user: JSON.parse(serialize(existUserEntity)) }
  }

  async createUser(request: CreateUserRequest): Promise<CreateUserResponse> {
    console.log(request, 'createUser')
    const existUserEntity = await this.userRepository.findOne({ where: { id: '1' } }) // 임시값, kakao Login 구현 필요

    return { user: JSON.parse(serialize(existUserEntity)) }
  }
}
