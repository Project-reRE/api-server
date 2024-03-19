import { Injectable } from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { UserEntity } from '../../entity/user.entity'
import { CreateUserRequest, CreateUserResponse, FindOneUserRequest, FindOneUserResponse } from '@grpc-idl/proto/user'

@Injectable()
export class UserService {
  constructor(
    @InjectDataSource() private connection: DataSource,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
  ) {}

  async findOneUser(request: FindOneUserRequest): Promise<FindOneUserResponse> {
    console.log(request)
    const existUserEntity = await this.userRepository.findOne({ where: { id: request.id } })
    if (!existUserEntity) {
      //404 NOT FOUND ERROR RETURN
    }
    console.log(existUserEntity)
    return { user: existUserEntity }
  }

  async createUser(request: CreateUserRequest): Promise<CreateUserResponse> {
    const existUserEntity = await this.userRepository.findOne({ where: { username: request.username } })
    if (existUserEntity) {
      //409 ALREADY EXIST USERNAME
    }

    /** USER 생성 로직 추가 */
    return { user: existUserEntity }
  }
}
