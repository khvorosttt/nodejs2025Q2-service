import { Injectable, Logger } from '@nestjs/common';
import { LEVEL_NAME, LOG_LEVEL } from './types/types';
import { join } from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class LoggingService {
  logger = new Logger();
  logLevel: number = null;
  logFilename: string;
  logDirname: string;
  logDirPath: string;
  logPath: string;
  errorPath: string;
  maxFileSizeBytes: number;

  constructor() {
    this.logFilename = 'app.log';
    this.logDirname = 'log';
    this.logDirPath = join(__dirname, '..', '..', 'log');
    this.logPath = join(this.logDirPath, this.logFilename);
    this.maxFileSizeBytes =
      (Number(process.env.LOG_MAX_FILE_SIZE) || 1024) * 1024;
    process.on('uncaughtException', (error: Error) => {
      this.error(
        `Uncaught Exception: ${error.message}`,
        error.stack,
        'Process',
      );
    });

    process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
      const reasonStr =
        reason instanceof Error ? reason.message : String(reason);
      this.error(
        `Unhandled Rejection at: ${promise}`,
        `Reason: ${reasonStr}`,
        'Process',
      );
    });
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

  private async createDir() {
    try {
      await fs.access(this.logDirPath);
    } catch {
      await fs.mkdir(this.logDirPath, { recursive: true });
    }
  }

  private async checkLogFile() {
    try {
      await fs.access(this.logPath);
      const info = await fs.stat(this.logPath);
      if (info.size >= this.maxFileSizeBytes) {
        await this.rotationLogFile();
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        this.logger.error('Error checking log file:', error.message);
      }
    }
  }

  private async rotationLogFile() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const newFileName = `app-${timestamp}.log`;
    const newFilePath = join(this.logDirPath, newFileName);
    await fs.rename(this.logPath, newFilePath);
    await fs.writeFile(this.logPath, '');
  }

  private async writeToFile(message: string) {
    try {
      await this.createDir();
      await this.checkLogFile();
      await fs.appendFile(this.logPath, message + '\n', { flag: 'a' });
    } catch (error) {
      this.logger.error('Failed to write log to file:', error.message);
    }
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
      this.writeToFile(info).catch((err) => {
        this.logger.error('Failed to write log file', err.stack);
      });
    }
  }

  addContext(context: string) {
    return context ? ` [${context}]` : '';
  }
}
