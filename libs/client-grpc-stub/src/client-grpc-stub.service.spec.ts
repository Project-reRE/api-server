import { Test, TestingModule } from '@nestjs/testing'
import { ClientGrpcStubService } from './client-grpc-stub.service'

describe('ClientGrpcStubService', () => {
  let service: ClientGrpcStubService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientGrpcStubService],
    }).compile()

    service = module.get<ClientGrpcStubService>(ClientGrpcStubService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
