/* eslint-disable */

export const protobufPackage = "user";

export interface User {
  id: string;
  externalId: string;
  nickName: string;
  description?: string | undefined;
  profileUrl?: string | undefined;
  email: string;
  provider: string;
  role: string;
  gender: boolean;
  birthDate: string;
  createdDate: string;
  updatedDate: string;
  deletedDate?: string | undefined;
}

export const USER_PACKAGE_NAME = "user";
