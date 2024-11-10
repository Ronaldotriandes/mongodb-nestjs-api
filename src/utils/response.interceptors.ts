import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export type Response<T> = {
  status: boolean;
  statusCode: number;
  path?: string;
  message?: string;
  data: T;
  timestamp: string;
};

interface Resp {
  message?: string;
  erorrs?: any[];
  error?: string;
}
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next
      .handle()
      .pipe(map((res: unknown) => this.responseHandler(res, context)));
  }

  errorHandler(exception: HttpException, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    console.log('asdasdasdasdasdasdasdas', exception.getResponse());
    const resp: string | Resp = exception.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception.message === 'ValidationError') {
      response.status(status).json({
        status: false,
        statusCode: status,
        path: request.url,
        message: exception.message,
        ...(typeof resp === 'object' ? resp : {}),
        timestamp: new Date().toISOString(),
      });
    }
    response.status(status).json({
      status: false,
      statusCode: status,
      path: request.url,
      message: exception.message,
      result: exception,
      timestamp: new Date().toISOString(),
    });
  }

  responseHandler(res: any, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    // const request = ctx.getRequest();
    const statusCode = response.statusCode;
    // console.log(res);
    return {
      status: true,
      statusCode,
      timestamp: new Date().toISOString(),
      ...(res?.meta || { data: res }),
    };
  }
}
