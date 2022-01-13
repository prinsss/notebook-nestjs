import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger
} from '@nestjs/common'
import { Request, Response } from 'express'
import { ErrorResponse } from './error-response.interface'

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const request = ctx.getRequest<Request>()
    const response = ctx.getResponse<Response>()

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    const errorResponse: ErrorResponse = {
      code: status,
      message: exception.message !== '' ? exception.message : HttpStatus[status]
    }

    // Other unhandled exceptions
    if (!(exception instanceof HttpException)) {
      const { method, url } = request
      Logger.error(`${method} ${url}`, exception.stack, 'ExceptionFilter')
      response.status(status).json(errorResponse)
      return
    }

    // By default, `throw new BadRequestException('xxx')` will generate:
    // => { statusCode: 400, message: 'xxx', error: 'Bad Request' }
    // as response and `throw new BadRequestException(4002, 'xxx')` generates:
    // => { statusCode: 400, message: 4002, error: 'xxx' }
    // which needs extra tweak to fit our response format.
    const originalResponse = exception.getResponse() as any

    if (
      originalResponse.message !== undefined &&
      typeof originalResponse.message === 'number'
    ) {
      errorResponse.code = originalResponse.message
      errorResponse.message = originalResponse.error
    }

    response
      .status(status)
      .json(
        originalResponse.code !== undefined ? originalResponse : errorResponse
      )
  }
}
