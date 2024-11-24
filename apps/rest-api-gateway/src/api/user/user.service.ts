import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { IsNull, Not, Repository } from 'typeorm'
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

const USER_PROFILE = [
  'https://rere-profile.s3.ap-northeast-2.amazonaws.com/Ch_Profile1.png',
  'https://rere-profile.s3.ap-northeast-2.amazonaws.com/Ch_Profile2.png',
  'https://rere-profile.s3.ap-northeast-2.amazonaws.com/Ch_Profile2-1.png',
  'https://rere-profile.s3.ap-northeast-2.amazonaws.com/Ch_Profile3.png',
  'https://rere-profile.s3.ap-northeast-2.amazonaws.com/Ch_Profile4.png',
]

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(DummyNickNameEntity)
    private readonly dummyNickNameRepository: Repository<DummyNickNameEntity>,
  ) {}

  async findOneUserExternal(request: FindOneUserExternalIdRequest): Promise<FindOneUserResponseDto> {
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

    return Object.assign(existUserEntity)
  }

  async isAlreadyEmailUsedOtherPlatform(externalId: string, email: string): Promise<boolean> {
    const existUserEntity = await this.userRepository.findOne({ where: { email, externalId: Not(externalId) } })

    return existUserEntity ? true : false
  }

  async findOneUser(request: FindOneUserRequest): Promise<FindOneUserResponseDto> {
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

    // 옵셔널하게 받지만, 받았을 경우 14세 미만인지 확인
    if (request.birthDate) {
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

    // random profile setup
    creatableUser.nickName = dummyNickName.nickName
    creatableUser.profileUrl = USER_PROFILE[Math.floor(Math.random() * USER_PROFILE.length)]

    const [createdUser] = await Promise.all([
      this.userRepository.save(creatableUser),
      this.dummyNickNameRepository.update({ id: dummyNickName.id }, { isUsed: 1 }),
    ])

    return Object.assign(createdUser)
  }

  async updateUser(request: UpdateUserRequestDto): Promise<UpdateUserResponseDto> {
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

    return Object.assign(savedUser)
  }

  async removeUser(request: FindOneUserRequest): Promise<RemoveUserResponseDto> {
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
    existUserEntity.email = `DELETED_` + existUserEntity.email

    await this.userRepository.save(existUserEntity)

    return { id: request.id }
  }

  async findByUserEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { email } })
  }
}
