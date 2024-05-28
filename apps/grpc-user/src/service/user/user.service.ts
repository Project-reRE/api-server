import { Injectable } from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { UserEntity } from '../../entity/user.entity'
import { CreateUserRequest, CreateUserResponse, FindOneUserRequest, FindOneUserResponse } from '@grpc-idl/proto/user'
import { status } from '@grpc/grpc-js'
import * as bcrypt from 'bcrypt'
import { serialize } from 'class-transformer'

const SALT_ROUNDS = 10

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
      throw {
        code: status.NOT_FOUND,
        message: [`USER_NOT_FOUND`],
      }
    }
    console.log(existUserEntity)
    return { user: JSON.parse(serialize(existUserEntity)) }
  }

  async createUser(request: CreateUserRequest): Promise<CreateUserResponse> {
    console.log(request, 'createUser')
    const existUserEntity = await this.userRepository.findOne({ where: { email: request.email } })
    if (existUserEntity) {
      //409 ALREADY EXIST USERNAME
      throw {
        code: status.ALREADY_EXISTS,
        message: [`NICKNAME_ALREADY_EXIST`],
      }
    }

    const encryptionPassword = await this.encryptionPassword(request.password)
    console.log(encryptionPassword)

    const creatableUserEntity = this.userRepository.create({ ...request, password: encryptionPassword })

    const createdUserEntity = await this.userRepository.save(creatableUserEntity)

    return { user: JSON.parse(serialize(createdUserEntity)) }
  }

  /**
   * 암호화된 비밀번호가 일치하는지 체크
   * */
  async comparePassword(password: string, hashPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashPassword)
  }

  /**
   * bcrypt 를 사용하여 비밀번호 암호화
   * */
  private encryptionPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
        if (err) {
          return reject(err)
        }
        resolve(hash)
      })
    })
  }
}
