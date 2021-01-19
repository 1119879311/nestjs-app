import { SetMetadata } from "@nestjs/common"

export type INoAuth = "ALL"|"ROLE"

export const  NoAuth = (name:INoAuth)=>SetMetadata("no-auth",name);// 如果用了装饰器，默认不用认证