import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { setupApiDocs } from 'common/config/api-docs';
import { ExceptionHandler } from 'common/filters';
import { loggerMiddleware } from 'common/middlewares';
import { CustomValidationPipe } from 'common/pipes';
import { logger as appLogger } from 'common/utils/logger';
import { AppModule } from 'modules/app/app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: appLogger,
  });
  const logger = new Logger(bootstrap.name);
  const configService = app.get('configService');

  app.enableCors();
  app.enableShutdownHooks();
  app.get(AppModule).subscribeToShutdown(() => app.close());

  app.use(loggerMiddleware);
  app.useGlobalFilters(new ExceptionHandler());
  app.useGlobalPipes(
    new CustomValidationPipe({
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      whitelist: true,
    }),
  );
  setupApiDocs(app);

  await app.listen(configService.get('PORT')).then(() => {
    logger.log(`Server is running on port ${configService.get('PORT')}`);
  });
}

bootstrap();

process.on(
  'unhandledRejection',
  function handleUnhandledRejection(err: Error): void {
    const logger = new Logger(handleUnhandledRejection.name);
    logger.error(err.stack);
  },
);
