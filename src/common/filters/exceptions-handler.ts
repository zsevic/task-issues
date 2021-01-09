import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class ExceptionHandler implements ExceptionFilter {
  private readonly logger = new Logger(ExceptionHandler.name);

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    if (status >= 500) {
      this.logger.error(exception.stack);
    } else {
      this.logger.error(exception.message);
    }

    response.status(status).json({
      message: exception.message,
      path: request.url,
      statusCode: status,
      timestamp: new Date().toISOString(),
    });
  }
}
