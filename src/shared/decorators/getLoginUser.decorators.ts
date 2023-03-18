import { ForbiddenException } from '@nestjs/common';
import { tk_user } from './../../entity/tk_user.entity';
import { createParamDecorator } from '@nestjs/common';
export interface ILoginUser extends tk_user {
    token:string
}
export const LoginUser = createParamDecorator((data:boolean=true, req) => {
    if(!req.user&&data){
       throw new ForbiddenException("非法访问")
    }
    return req.user;
});
