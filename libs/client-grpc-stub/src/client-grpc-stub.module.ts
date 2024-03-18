import { Module } from '@nestjs/common'
import { ClientGrpcStubService } from './client-grpc-stub.service'

@Module({
  providers: [ClientGrpcStubService],
  exports: [ClientGrpcStubService],
})
export class ClientGrpcStubModule {}
