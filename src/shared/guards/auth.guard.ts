import { IS_PUBLIC_KEY, IS_AUTH_KEY } from './../decorators/authorization.decorator';
import {  CACHE_MANAGER, ExecutionContext, ForbiddenException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from '@nestjs/passport';
import {Cache} from "cache-manager"
// 默认所有请求都需要身份auth 认证，根据是否用了装饰器NoAuth标记过滤掉
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        private reflector:Reflector,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ){
        super();
    }
    
    async canActivate(context: ExecutionContext): Promise<any> {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
        // console.log("用户认证",context.switchToHttp().getRequest().user)
        let isPulic = this.reflector.get(IS_PUBLIC_KEY,context.getHandler() )
        if(isPulic){
          return true
        }
        let isAuth = this.reflector.getAllAndOverride(IS_AUTH_KEY,[
          context.getHandler(),
          context.getClass(),
        ])
        // 默认不认证
        if(isAuth===undefined){
          return true
        }
        return super.canActivate(context);
        // let result =  await super.canActivate(context);
        // let userInfo = context.switchToHttp().getRequest().user;
        // if(!userInfo) {
        //    throw new ForbiddenException("非法访问")
        // }
        // console.log("读取缓存数据：",await this.cacheManager.get(`${userInfo.id}_${userInfo.user_key}`))
        // return result;
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException("非法访问");
    }
    return user;
  }
}
