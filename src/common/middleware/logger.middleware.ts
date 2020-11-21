import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';


@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    Logger.log(`${req.headers.host}:${req.originalUrl}[${req.method}]`,"请求日志")
    next();
  }
}
