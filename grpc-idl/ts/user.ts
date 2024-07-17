/* eslint-disable */

export const protobufPackage = 'user'

export interface User {
  id: string
  externalId: string
  nickName: string
  description?: string | undefined
  profileUrl?: string | undefined
  email: string
  provider: string
  role: string
  gender: boolean
  birthDate: string
  createdAt: string
  updatedAt: string
  deletedAt?: string | undefined
}

export const USER_PACKAGE_NAME = 'user'
