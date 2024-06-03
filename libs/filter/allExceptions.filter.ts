import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { Request, Response } from 'express'
import { RpcException } from '@nestjs/microservices'
import { Status } from '@grpc/grpc-js/build/src/constants'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let errorResponse: { statusCode: number; code: string; message: string[] } = {
      statusCode: status,
      code: 'INTERNAL_ERROR',
      message: ['Internal server error'],
    }

    if (exception instanceof RpcException) {
      // gRPC 서버에서 전달된 에러 처리
      const error = exception.getError() as any

      console.log('@@@@@@@@@@@')
      const httpStatus = status ? this.convertGrpcErrorCodeToHttpStatusCode(error.code) : 500
      console.log('@@@@@@@@@@@')
      console.log(httpStatus)
      console.log('@@@@@@@@@@@')
      if (error && typeof error === 'object') {
        errorResponse = {
          statusCode: httpStatus,
          code: error.code || 'INTERNAL_ERROR',
          message: [error.message || 'Internal server error'],
        }
      } else {
        // gRPC 오류 메시지가 문자열로 오는 경우 처리
        const errorMessage = exception.message
        const [grpcCode, ...messageParts] = errorMessage.split(':')
        const httpStatus = status ? this.convertGrpcErrorCodeToHttpStatusCode(status).valueOf() : 500
        console.log('############')
        console.log(httpStatus)
        console.log('############')
        errorResponse = {
          statusCode: httpStatus,
          code: grpcCode.trim() || 'INTERNAL_ERROR',
          message: [messageParts.join(':').trim() || 'Internal server error'],
        }
      }
    } else if (exception instanceof HttpException) {
      console.log('!!!!!!!')
      console.log('!!!!!!!')
      // HTTP 에러 처리
      const httpResponse = exception.getResponse() as any
      status = exception.getStatus()
      errorResponse = {
        statusCode: status,
        code: httpResponse?.error || 'INTERNAL_ERROR',
        message: Array.isArray(httpResponse?.message)
          ? httpResponse.message
          : [httpResponse?.message || 'Internal server error'],
      }
    } else if (exception instanceof Error) {
      // 기타 에러 처리
      errorResponse = {
        statusCode: status,
        code: 'INTERNAL_ERROR',
        message: [exception.message],
      }
    }

    response.status(status).json(errorResponse)
  }

  private convertGrpcErrorCodeToHttpStatusCode(grpcCode: any): HttpStatus {
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
