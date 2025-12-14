import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { LoggingService } from './logging.service';
import { catchError, tap } from 'rxjs/operators';
import { LOG_LEVEL } from './types/types';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly loggingService: LoggingService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const { url, headers, hostname, query, body, method } = context
      .switchToHttp()
      .getRequest();
    const httpResponse = context.switchToHttp().getResponse();
    const startTime = Date.now();
    this.loggingService.log(
      this.requestMessage(
        LOG_LEVEL.LOG,
        url,
        headers,
        hostname,
        query,
        body,
        method,
      ),
    );
    this.loggingService.debug(
      this.requestMessage(
        LOG_LEVEL.DEBUG,
        url,
        headers,
        hostname,
        query,
        body,
        method,
      ),
    );
    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - startTime;
        if (httpResponse.statusCode >= 400) {
          this.loggingService.warn(
            this.responseMessage(
              LOG_LEVEL.WARN,
              method,
              url,
              httpResponse.statusCode,
              responseTime,
              httpResponse.data,
            ),
          );
        } else {
          this.loggingService.log(
            this.responseMessage(
              LOG_LEVEL.LOG,
              method,
              url,
              httpResponse.statusCode,
              responseTime,
              httpResponse.data,
            ),
          );
        }
        this.loggingService.debug(
          this.responseMessage(
            LOG_LEVEL.DEBUG,
            method,
            url,
            httpResponse.statusCode,
            responseTime,
            httpResponse.data,
          ),
        );
      }),
      catchError((error) => {
        this.loggingService.error(error.message, error.stack);
        throw error;
      }),
    );
  }

  requestMessage(type, url, headers, hostname, query, body, method) {
    let message = `\nREQUEST: ${method} ${url}${this.addQuery(query)}${this.addBody(body)}`;
    if (type === LOG_LEVEL.DEBUG) {
      message = `REQUEST DETAILS: \nHOSTNAME: ${hostname}\nHEADERS: ${headers}\n${message}`;
    }
    return message;
  }

  responseMessage(type, method, url, statusCode, responseTime, data?) {
    if (type !== LOG_LEVEL.DEBUG) {
      const message = `\nRESPONSE: [${statusCode}] URL: ${url} - ${responseTime}ms`;
      return message;
    }
    const message = `\nRESPONSE DETAILS: [${statusCode}] - ${responseTime}ms\nMETHOD: ${method}\nURL: ${url}\nDATA: ${data}`;
    return message;
  }

  addBody(body) {
    return body && Object.keys(body).length
      ? ` - BODY: ${JSON.stringify(body)}`
      : '';
  }

  addQuery(query) {
    return query && Object.keys(query).length
      ? ` QUERY: ?${JSON.stringify(query)}`
      : '';
  }
}
