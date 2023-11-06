import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const res: any = exception.getResponse();

    const message = typeof res === 'string' ? res : res?.message;
    const statusCode =
      typeof res === 'string' ? status : res?.statusCode || status;
    const error =
      typeof res === 'string' ? exception.name : res?.error || exception.name;

    const displayedResponse = {
      status: statusCode,
      statusCode,
      message,
      error,
    };

    response.status(status).json(displayedResponse);
  }
}
