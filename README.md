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
