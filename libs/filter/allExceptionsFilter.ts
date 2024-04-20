import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common'
import { BaseRpcExceptionFilter } from '@nestjs/microservices'
import { throwError } from 'rxjs'
import { ServiceError } from '@grpc/grpc-js'
import { Status } from '@grpc/grpc-js/build/src/constants'
import { ExceptionFilter } from './rpc-exception.filter'
import { Response } from 'express'

@Catch()
export class AllExceptionsFilter extends ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    switch (host.getType()) {
      case 'rpc':
        //TODO [DEBUG] Log 전체 제거
        console.log('[DEBUG]RPC ERROR HERE')
        return throwError(() => exception)

      case 'http':
        console.log('[DEBUG] ALL Execption HTTP Exception HERE ')
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()
        const error: ServiceError = exception.getError() as ServiceError
        const grpcErrorCode = error.code

        const httpStatusCode: HttpStatus = this.convertGrpcErrorCodeToHttpStatusCode(grpcErrorCode)

        response.status(httpStatusCode).json({
          message: [error.details],
        })
        break
    }
  }

  private convertGrpcErrorCodeToHttpStatusCode(grpcCode: Status): HttpStatus {
    switch (grpcCode) {
      case Status.INVALID_ARGUMENT:
        return HttpStatus.BAD_REQUEST
      case Status.FAILED_PRECONDITION:
      case Status.OUT_OF_RANGE:
        return HttpStatus.BAD_REQUEST
      case Status.UNAUTHENTICATED:
        return HttpStatus.UNAUTHORIZED
      case Status.PERMISSION_DENIED:
        return HttpStatus.FORBIDDEN
      case Status.NOT_FOUND:
        return HttpStatus.NOT_FOUND
      case Status.ABORTED:
      case Status.ALREADY_EXISTS:
        return HttpStatus.CONFLICT
      case Status.DATA_LOSS:
      case Status.UNKNOWN:
      case Status.INTERNAL:
        return HttpStatus.INTERNAL_SERVER_ERROR
      case Status.UNIMPLEMENTED:
        return HttpStatus.NOT_IMPLEMENTED
      case Status.UNAVAILABLE:
        return HttpStatus.SERVICE_UNAVAILABLE
      case Status.DEADLINE_EXCEEDED:
        return HttpStatus.GATEWAY_TIMEOUT
      case Status.RESOURCE_EXHAUSTED:
        return HttpStatus.TOO_MANY_REQUESTS

      default:
        return HttpStatus.INTERNAL_SERVER_ERROR
    }
  }
}
