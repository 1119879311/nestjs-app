import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService{
    constructor(
        private jwtService:JwtService
    ){}
    
    /**
     * 
     * @param payload 验证内容体
     */
    async  validateUser<T>(payload:T){
        // 这里应该调用 userService 
        // return {id:1,username:"admin"};
        return payload
    }
    /**
     * 
     * @param payload 生成签名jwt
     */
    async loginSign<T extends {}>(payload:T){
        
        return this.jwtService.sign({...payload})
    }
}