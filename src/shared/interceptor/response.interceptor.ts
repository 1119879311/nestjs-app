// 全局响应拦截器
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppLogger } from '../logger/logger.service';
import { getClientIp } from '../util';
// 声明
interface ResBody<T> {
  data: T;
}

// 注意：响应映射功能不适用于特定于库的响应策略（禁止直接使用@Res()对象）。

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResBody<T>> {
  constructor(private readonly appLogger: AppLogger) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ResBody<T>> | Promise<Observable<ResBody<T>>> {
    const ctx = context.switchToHttp();
    // const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    // console.log("before:","全局响应拦截器之前")
    let now = Date.now();
    this.appLogger.log(
      `${req.originalUrl},${getClientIp(req)}`,
      'BeforeResponse',
    );
    console.log('req', req.headers);
    return next.handle().pipe(
      map((data: T) => {
        this.appLogger.log(
          `${req.originalUrl},${getClientIp(req)},【${Date.now() - now}ms】`,
          'AfterResponse',
        );

        return {
          statusCode: 200,
          data: data,
          status: true,
          message: '操作成功',
        };
      }),
    );
  }
}
