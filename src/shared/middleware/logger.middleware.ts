// import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
export function LoggerMiddleware(req:Request, res:Response, next:Function) {
    next();
  };
// @Injectable()
// export class LoggerMiddleware implements NestMiddleware {
  
//   use(req: Request, res: Response, next: Function) {
//     console.log("------before")
//     next();
//     console.log("-----after")
//   }
// }
