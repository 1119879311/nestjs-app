import { AuthService } from './../../modules/auth/auth.service';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { ILoginUser } from '../decorators/getLoginUser.decorators';

@Injectable()
export class IsSystemMiddleware implements NestMiddleware {
  constructor(
      private readonly authService:AuthService
  ){}
  async use(req: Request, res: Response, next: Function) {
    let token = req.headers.authorization?.replace("Bearer ",'');
    try {
      let res:ILoginUser =  await  this.authService.jwtVerify(token)
      if(res.user_type==1||res.user_type==2){
        await  next();
      }else{
        throw new ForbiddenException("禁止访问")
      }
      
    } catch (error) {
        throw new UnauthorizedException("非法访问")
    }
   
   
  }
}
