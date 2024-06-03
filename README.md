# 기획서
  - [기획서 Figma Link](https://www.figma.com/file/ZZ6EVbe28gv4BXzipp9q0L/App-reRE?type=design&node-id=1-3&mode=design&t=llQ8kmT1cuo8LCIW-0)
## Service Architecture
- Service 확장성 + 기술 확장성을 고려하여 MSA 구조로 진행
  - [MSA 구조 장단점 링크]( https://velog.io/@whitebear/MSA)
- MSA 구조로 할 경우, 문제점
  - DB 구조
    - 공통으로 사용되는 Table의 경우(ex user Table Data 복제 이슈, Relation 문제가 있음)
    - Kafka 를 활용하여 Event Driven Pattern 적용
    - https://medium.com/dtevangelist/event-driven-microservice-%EB%9E%80-54b4eaf7cc4a
- Service 구성도
  - TBD
## Table 
[ERD CLOUD](https://www.erdcloud.com/d/kMhhaePaTf3vPRSCB)

![image](https://github.com/Project-reRE/api-server/assets/20696473/bd03e324-fe4e-4f4c-a41e-762b28cc4eb4)

### TBD
## Service
###  Rest-api-gateway
#### REST 방식을 사용하여 Client와 grpc 서버들 사이 연결
- TBD
### grpc server
- grpc를 사용하여 rest 와 연결
- grpc 설명 TBD , 사용 이유 TBD
#### grpc-user
- user table 담당 비즈니스 로직 구현
- TBD
#### grpc-statistics
- statistics table 담당 비즈니스 로직 구현
- TBD
#### grpc-moive
- moive table 담당 비즈니스 로직 구현
- TBD


## Service 구조도 (간단 버전, UI 업그레이드 필요)
![image](https://github.com/Project-reRE/api-server/assets/20696473/98091b46-d81d-46ed-8226-5b32adb57fe7)

## 개발 진행 상황
### Backend 진행 상황
### 개발
##### 유저 서비스
###### 유저 조회
- @GET users/{userId}
###### 회원가입
- 카카오 (개발 중)
- 클라랑 같이 소셜 로그인 기능 필요
- 애플 (개발 전)
- 클라랑 같이 소셜 로그인 기능 필요
- ID/PW  (개발 완료)
- 소셜 로그인 기능 개발 완료시, ADMIN 계정 생성용으로만 사용 예정
##### 영화 검색 기능 (개발 완료)
- @GET /movies
- queryParams 및 response 적용하면서 수정 논의 필요
- 화면 : 영화 검색
###### grpc-movie (개발 중)
- 검색 된 영화 저장
- 화면 : 없음 _ 영화 평가 및 랭킹 데이터 생성 용
- 로그인 기능 (개발 중)
###### Auth Token 적용
- API  Role Guard 적용
- 화면 : 없음, 전반적인 관리
- 영화 평가 기능 추가 개발전_로그인 기능 개발 필요
###### 영화 평가 기능 추가
- @POST 'revaluations'
- body : movieId
- 화면 : 영화 재평가 하기
###### 유저별 재평가 리스트 조회
- @GET 'revaluations'
- querytParams : userId
- 화면 : 재평가한 영화 목록 보기 
###### 랭킹 기능 추가 개발전_로그인 기능 개발 필요
- @GET 'open-moive-ranking'
- 화면 : 데일리 랭킹 표시 (랭킹)
- 배너 기능 추가개발전_로그인 기능 개발 필요
- @GET 'open-moive-banner'
###### Movie Banner
- 화면 : 데일리 랭킹 표시 (배너)
- @GET 'open-moive-banner-rolling-configuration'
- 배너 Rolling Config 값
### 인프라
#### AWS 인프라 셋팅
##### WAF
##### 포트 OPEN
##### API 서버 CI / CD
##### 웹서버 CI / CD 

## typeORM
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456

[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If
you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

## Build Commands

### Build and Run grpc-user Service Only
```sh
docker build -t grpc-user-service -f apps/grpc-user/Dockerfile .
docker run -d -p 50051:50051 grpc-user-service
```

### Build and Run rest-api-gateway Service Only
```sh
docker build -t rest-api-gateway-service -f apps/rest-api-gateway/Dockerfile .
docker run -d -p 3000:3000 rest-api-gateway-service
```

### Build and Run All Services with docker-compose
```sh
docker-compose up --build
```

### Build and Run MySQL Service Only
```sh
cd db
docker-compose -f docker-compose-db.yml up
```
