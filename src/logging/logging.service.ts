import { Injectable, Logger } from '@nestjs/common';
import { LEVEL_NAME, LOG_LEVEL } from './types/types';

@Injectable()
export class LoggingService {
  logger = new Logger();
  logLevel: number = null;
  logFilename: string;
  logDirname: string;

  constructor() {
    this.logFilename = 'app.log';
    this.logDirname = 'log';
  }

  private getLogLevel(): number {
    if (this.logLevel === null) {
      this.logLevel = Number(process.env.LOG_LEVEL) || LOG_LEVEL.DEBUG;
    }
    return this.logLevel;
  }

  private shouldLog(level) {
    return level <= this.getLogLevel();
  }

  error(message: string, trace?: string, context?: string) {
    const fullMessage = trace ? `${message}\n${trace}` : message;
    this.commonLog(LOG_LEVEL.ERROR, fullMessage, context);
  }

  warn(message: string, context?: string) {
    this.commonLog(LOG_LEVEL.WARN, message, context);
  }

  log(message: string, context?: string) {
    this.commonLog(LOG_LEVEL.LOG, message, context);
  }

  debug(message: string, context?: string) {
    this.commonLog(LOG_LEVEL.DEBUG, message, context);
  }

  commonLog(level: LOG_LEVEL, message: string, context?: string) {
    if (this.shouldLog(level)) {
      const info = `[${new Date().toISOString()}] [${LEVEL_NAME[level]}]${this.addContext(context)} ${message}`;
      switch (level) {
        case LOG_LEVEL.ERROR:
          this.logger.error(info);
          break;
        case LOG_LEVEL.WARN:
          this.logger.warn(info);
          break;
        case LOG_LEVEL.LOG:
          this.logger.log(info);
          break;
        case LOG_LEVEL.DEBUG:
          this.logger.debug(info);
          break;
      }
    }
  }

  addContext(context: string) {
    return context ? ` [${context}]` : '';
  }
}
