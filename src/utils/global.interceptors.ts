import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface MessageResponse {
  error?: string;
  message?: string;
  errors?: string[];
}
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message: MessageResponse | string =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal Server Error';
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(typeof message === 'object'
        ? {
            message: message?.error,
            ...(message?.errors ? {} : { error: message.message }),
            ...(message?.errors ? { error: message.errors } : {}),
          }
        : { message }),
    });
  }
}
