import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';

export const logger = WinstonModule.createLogger({
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console({
      level: process.env.LOG_LEVEL || 'info',
    }),
  ],
});
