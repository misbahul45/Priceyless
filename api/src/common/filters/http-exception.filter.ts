import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse: any = exception.getResponse();

    let message = exception.message;
    let details = [];
    let code = 'INTERNAL_SERVER_ERROR';

    if (status === HttpStatus.BAD_REQUEST) {
      code = 'BAD_REQUEST';
      message = exceptionResponse.message || 'Bad Request';
      if (Array.isArray(exceptionResponse.errors)) {
        details = exceptionResponse.errors;
      } else if (Array.isArray(exceptionResponse.message)) {
          details = exceptionResponse.message;
          message = 'Validation failed';
      }
    } else if (status === HttpStatus.UNAUTHORIZED) {
      code = 'UNAUTHORIZED';
    } else if (status === HttpStatus.FORBIDDEN) {
      code = 'FORBIDDEN';
    } else if (status === HttpStatus.NOT_FOUND) {
      code = 'NOT_FOUND';
    } else if (status === HttpStatus.CONFLICT) {
      code = 'CONFLICT';
    }

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} - ${status} - ${exception.message}`,
        exception.stack,
      );
    }

    response.status(status).json({
      status: 'error',
      message: message,
      error: {
        code,
        details,
      },
    });
  }
}
