import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 1. Determinar el código de estado HTTP
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // 2. Extraer el mensaje del error
    let message = 'Ocurrió un error inesperado en el servidor';
    if (exception instanceof HttpException) {
      const resContent = exception.getResponse();
      message =
        typeof resContent === 'object' &&
        'message' in resContent &&
        typeof resContent.message == 'string'
          ? resContent['message']
          : exception.message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // 3. Registrar el error en la consola del servidor
    this.logger.error(
      `[Error] ${request.method} ${request.url} - ${message}`,
      exception,
    );

    // 4. Enviar respuesta estandarizada al cliente
    response.status(status).json({
      status: false,
      code: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
