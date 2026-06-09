import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((response) => {
        if (
          response &&
          typeof response === 'object' &&
          'status' in response &&
          'data' in response
        ) {
          return response;
        }

        if (
          response &&
          typeof response === 'object' &&
          'message' in response &&
          'data' in response
        ) {
          return {
            status: 'success',
            message: response.message,
            data: response.data,
          };
        }

        return {
          status: 'success',
          message: 'Request successful',
          data: response ?? null,
        };
      }),
    );
  }
}
