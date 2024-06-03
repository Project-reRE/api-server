import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { Observable, throwError } from 'rxjs'

@Catch(RpcException)
export class GrpcExceptionsFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const error = exception.getError() as any

    const statusCode = error?.status || HttpStatus.INTERNAL_SERVER_ERROR
    const errorResponse = {
      statusCode: statusCode,
      code: error?.code || 'INTERNAL_ERROR',
      message: [error?.message || 'Internal server error'],
    }

    return throwError(() => new RpcException(errorResponse))
  }
}
