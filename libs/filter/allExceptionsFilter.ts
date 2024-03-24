import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common'
import { BaseRpcExceptionFilter } from '@nestjs/microservices'
import { throwError } from 'rxjs'
import { ServiceError } from '@grpc/grpc-js'
import { Status } from '@grpc/grpc-js/build/src/constants'
import { ExceptionFilter } from './rpc-exception.filter'

@Catch()
export class AllExceptionsFilter extends ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.log('>>>>')
    console.log(exception)
    console.log('<<<<<<')
    console.log(host.getType())

    switch (host.getType()) {
      case 'rpc':
        return throwError(() => exception)

      case 'http':
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()

        const error: ServiceError = exception.getError() as ServiceError

        const grpcErrorCode = error.code

        console.log(grpcErrorCode)

        const httpStatusCode: HttpStatus = this.convertGrpcErrorCodeToHttpStatusCode(grpcErrorCode)

        console.log(httpStatusCode)

        let errorBody

        try {
          errorBody = JSON.parse(error.details)
        } catch (e) {
          errorBody = {
            statusCode: 500,
            code: 'UNKNOWN_ERROR_RPC',
            message: [error.details],
          }
        }

        const errorCode = errorBody.code ?? 'UNKNOWN_ERROR_RPC'
        const message = errorBody.message

        return null
      case 'ws':
        return
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
