import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
const permList = ['per-modify','getManagerRole']

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
        private reflector:Reflector
    ){}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        console.log("角色守卫")
        let permissions = this.reflector.get<string>("permissions",context.getHandler())
        if(!permissions) return true;
        const req = context.switchToHttp().getRequest();
        let user = req.user;
        if(!user){
            throw new UnauthorizedException("非法访问")
        }

        // 这里进行查库是否存在url访问权限
        if(permList.includes(permissions)) return true;
        throw new ForbiddenException("无权访问");
       
    }
   
}