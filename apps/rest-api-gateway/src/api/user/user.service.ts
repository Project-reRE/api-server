import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '../../entity/user.entity'
import { FindOneUserExternalIdRequest, FindOneUserRequest } from '@grpc-idl/proto/user.service'
import { CreateUserRequestDto } from './dto/create-user-request.dto.st'
import { FindOneUserResponseDto } from './dto/find-one-user-response.dto'
import { CreateUserResponseDto } from './dto/create-user-response.dto'

import * as moment from 'moment'
import { UpdateUserRequestDto } from './dto/update-user-request.dto.st'
import { UpdateUserResponseDto } from './dto/update-user-response.dto.st'
import { RemoveUserResponseDto } from './dto/remove-user-response.dto.st'
import { DummyNickNameEntity } from '../../entity/dummy.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(DummyNickNameEntity)
    private readonly dummyNickNameRepository: Repository<DummyNickNameEntity>,
  ) {}

  async findOneUserExternal(request: FindOneUserExternalIdRequest): Promise<FindOneUserResponseDto> {
    // console.log(request, 'findOneUserExternal')
    const existUserEntity = await this.userRepository.findOne({
      where: { externalId: request.externalId },
      relations: { statistics: true },
    })

    if (!existUserEntity) {
      throw new HttpException(
        {
          code: 'USER_NOTFOUND',
          status: HttpStatus.NOT_FOUND,
          message: `가입 되지 않은 사용자(externalId : ${request.externalId})`,
        },
        HttpStatus.NOT_FOUND,
      )
    }

    // console.log(existUserEntity, 'findOneUserExternal')

    return Object.assign(existUserEntity)
  }

  async findOneUser(request: FindOneUserRequest): Promise<FindOneUserResponseDto> {
    // console.log(request, 'findOneUser')
    const existUserEntity = await this.userRepository.findOne({
      where: { id: request.id },
      relations: { statistics: true },
    })
    if (!existUserEntity) {
      throw new HttpException(
        {
          code: 'USER_NOTFOUND',
          status: HttpStatus.NOT_FOUND,
          message: `가입 되지 않은 사용자(id : ${request.id})`,
        },
        HttpStatus.NOT_FOUND,
      )
    }

    if (!existUserEntity.statistics) {
      existUserEntity.statistics = {
        id: '999',
        numRevaluations: 48,
      }
    }

    return Object.assign(existUserEntity)
  }

  async createUser(request: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    // console.log(request, 'createUser')

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

    // 만 14세 미만인지 확인
    const birthDate = moment(request.birthDate)
    const currentDate = moment()
    const age = currentDate.diff(birthDate, 'years')

    if (age < 14) {
      throw new HttpException(
        {
          code: 'UNDERAGE_USER',
          status: HttpStatus.BAD_REQUEST,
          message: `만 14세 미만은 가입할 수 없습니다.(나이 : ${age})`,
        },
        HttpStatus.BAD_REQUEST,
      )
    }

    const creatableUser = this.userRepository.create({ ...request, statistics: {} })

    const dummyNickName = await this.dummyNickNameRepository
      .createQueryBuilder()
      .where('isUsed = :isUsed', { isUsed: 0 })
      .orderBy('RAND()')
      .getOne()

    if (dummyNickName == null) {
      throw new HttpException(
        { message: 'already used all dummy nickName, plz supply more nickname' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }

    creatableUser.nickName = dummyNickName.nickName

    const createdUser = await this.userRepository.save(creatableUser)

    // console.log(createdUser, 'createUser', 'createdUser')

    return Object.assign(createdUser)
  }

  async updateUser(request: UpdateUserRequestDto): Promise<UpdateUserResponseDto> {
    // console.log(request, 'updateUser')

    const existUserEntity = await this.userRepository.findOne({ where: { id: request.id } })

    if (!existUserEntity) {
      throw new HttpException(
        {
          code: 'USER_NOTFOUND',
          status: HttpStatus.NOT_FOUND,
          message: `가입 되지 않은 사용자(id : ${request.id})`,
        },
        HttpStatus.NOT_FOUND,
      )
    }

    if (request.email) {
      const existUserEmailEntity = await this.userRepository.findOne({ where: { email: request.email } })

      if (existUserEmailEntity) {
        throw new HttpException(
          {
            code: 'ALREADY_EXIST_EMAIL',
            status: HttpStatus.CONFLICT,
            message: `이미 사용중인 이메일 `,
          },
          HttpStatus.CONFLICT,
        )
      }
    }

    if (request.nickName) {
      const existUserNickNameEntity = await this.userRepository.findOne({ where: { nickName: request.nickName } })

      if (existUserNickNameEntity) {
        throw new HttpException(
          {
            code: 'ALREADY_EXIST_NICK_NAME',
            status: HttpStatus.CONFLICT,
            message: `이미 사용중인 NickN ame `,
          },
          HttpStatus.CONFLICT,
        )
      }
    }

    const updatableUserEntity = this.userRepository.merge(existUserEntity, request)

    const savedUser = await this.userRepository.save(updatableUserEntity)

    // console.log(savedUser, 'updateUser', 'savedUser')

    return Object.assign(savedUser)
  }

  async removeUser(request: FindOneUserRequest): Promise<RemoveUserResponseDto> {
    // console.log(request, 'removeUser')

    const existUserEntity = await this.userRepository.findOne({ where: { id: request.id } })

    if (!existUserEntity) {
      throw new HttpException(
        {
          code: 'USER_NOTFOUND',
          status: HttpStatus.NOT_FOUND,
          message: `가입 되지 않은 사용자(id : ${request.id})`,
        },
        HttpStatus.NOT_FOUND,
      )
    }

    // 회원 탈퇴시, 재회원가입 허용을 위해 Unique 처리된 Nickname, externalId, email Key값을 변경해줘야함

    existUserEntity.deletedAt = new Date()

    existUserEntity.externalId = 'DELETED_' + existUserEntity.externalId
    existUserEntity.nickName = 'DELETED_' + existUserEntity.nickName
    existUserEntity.email = 'DELETED_' + existUserEntity.email

    await this.userRepository.save(existUserEntity)

    return { id: request.id }
  }
}
