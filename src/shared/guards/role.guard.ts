import { IS_AUTH_KEY } from './../decorators/authorization.decorator';
import { CACHE_MANAGER, CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { UserCenterService } from "src/modules/user/userCenter.service";
import {Cache} from "cache-manager"
// const permList = ['per-modify','getManagerRole']

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
        private reflector:Reflector,
        private userCenterService:UserCenterService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ){}
     canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        console.log("角色守卫",context.switchToHttp().getRequest().user)
        // let permissions = this.reflector.get<string>("permissions",context.getHandler())
        let authName = this.reflector.get<string>(IS_AUTH_KEY,context.getHandler())
        // console.log("角色守卫---",authName,typeof authName!=="string")
        if(typeof authName!=="string") return true;
        const req = context.switchToHttp().getRequest();
        let user = req.user;
        if(!user){
            throw new ForbiddenException("非法访问")
        }
       
        // 这里进行查库是否存在url访问权限
        // if(permList.includes(permissions)) return true;
         return  this.userCenterService.verfiyAutorify(user.id,authName);
        // throw new ForbiddenException("无权访问");
       
    }
   
}