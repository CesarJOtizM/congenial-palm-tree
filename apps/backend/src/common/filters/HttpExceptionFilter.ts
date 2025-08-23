import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
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
    const exceptionResponse = exception.getResponse();

    const errorResponse = {
      success: false,
      message: this.extractMessage(exceptionResponse),
      error: {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
      },
    };

    // Log the error
    this.logger.error(
      `HTTP Exception: ${status} - ${request.method} ${request.url}`,
      {
        exception: exceptionResponse,
        userAgent: request.get('User-Agent'),
        ip: request.ip,
      }
    );

    response.status(status).json(errorResponse);
  }

  private extractMessage(
    exceptionResponse: string | { message?: string | string[] }
  ): string {
    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }

    if (
      exceptionResponse.message &&
      typeof exceptionResponse.message === 'string'
    ) {
      return exceptionResponse.message;
    }

    if (exceptionResponse.message && Array.isArray(exceptionResponse.message)) {
      return exceptionResponse.message[0] || 'Internal server error';
    }

    return 'Internal server error';
  }
}
