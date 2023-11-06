import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Error } from 'mongoose';

@Catch(Error.CastError)
export class CastObjectIdExceptionFilter implements ExceptionFilter {
  catch(_exception: Error.CastError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    response.status(404).json({
      statusCode: 404,
      message: 'Not Found',
      error: 'Resource not found',
    });
  }
}
