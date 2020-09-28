import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Aes } from "src/common/util";
import { tk_user } from "src/entity/tk_user.entity";
import { Repository } from "typeorm";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class UserCenterService{
    constructor(
        private configService:ConfigService,
        private authService:AuthService,
        @InjectRepository(tk_user) private readonly tkUserRepository: Repository<tk_user>
    ){}

    
    //修改当前用户密码
    async modifypwd(data:{id:number,password:string}){

        //加密
        let aesPassword = Aes.encryption(data.password,this.configService.get('password_secret'))
        try {
          let res = await  this.tkUserRepository.update(data.id,{password:aesPassword})
          console.log("modifypwd",res)
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException()
        }

    }

    // 找当前用户的所属角色和权限
    getManagerRole(id:number){

    }
}