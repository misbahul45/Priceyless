import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, originalUrl, ip } = request;
    const userAgent = request.get('user-agent') || '';
    
    // Attempt to safely extract user ID without breaking types if user is undefined
    const userId = (request as any).user?.id || (request as any).user?.userId || 'anonymous';

    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse<Response>();
          const { statusCode } = response;
          const contentLength = response.get('content-length');
          const duration = Date.now() - startTime;

          this.logger.log(
            `${method} ${originalUrl} ${statusCode} ${contentLength || 0}B - ${duration}ms - IP: ${ip} - User: ${userId} - UA: ${userAgent}`,
          );
        },
        error: (error) => {
          const statusCode = error?.status || error?.statusCode || 500;
          const duration = Date.now() - startTime;

          this.logger.error(
            `${method} ${originalUrl} ${statusCode} - ${duration}ms - IP: ${ip} - User: ${userId} - Error: ${error.message}`,
          );
        },
      }),
    );
  }
}
