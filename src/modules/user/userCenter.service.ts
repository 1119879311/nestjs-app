import { tk_authority } from './../../entity/tk_authority.entity';
// import { tk_role } from './../../entity/tk_role.entity';
import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Aes, oneToTree } from "src/common/util";
import { tk_user } from "src/entity/tk_user.entity";
import { Repository } from "typeorm";
// import { AuthService } from "../auth/auth.service";


@Injectable()
export class UserCenterService{
    constructor(
        private configService:ConfigService,
        // private authService:AuthService,
        @InjectRepository(tk_user) private readonly tkUserRepository: Repository<tk_user>,
        // @InjectRepository(tk_role) private readonly tkRoleRepository: Repository<tk_role>,
        @InjectRepository(tk_authority) private readonly tkAuthRepository: Repository<tk_authority>


    ){}

    
    //修改当前用户密码
    async modifypwd(data:{id:number,password:string}){
        //加密
        let aesPassword = Aes.encryption(data.password,this.configService.get('password_secret'))
        let res = await this.tkUserRepository.createQueryBuilder("u").update(tk_user)
            .set({ password: aesPassword}).where("id =:id", { id: data.id }).execute();
        if(res.affected>0){
            return res.affected
        }
    }

    // 找当前用户的所属角色和权限
    async getManagerRole(id:number){
        let res = await this.tkUserRepository
        .createQueryBuilder('u')
        .leftJoinAndSelect('u.roles','r',"r.status = :status", { status: 1 })
        .where("u.id=:id",{id})
        .getOne()
        if(!res){
            throw new BadRequestException('用户不存在')
        }
        if(res.user_type!==1&&res.status!==1){
            throw new BadRequestException('用户已经被禁用')
        }

        let authInfo:tk_authority[]=[];
        if(res.user_type===1){
            authInfo = await this.tkAuthRepository.createQueryBuilder("auth").orderBy({"auth.sort":"ASC"}).where(' auth.auth_type=1').getMany()
        
        }else{
            //存在角色
            if(res.roles.length>0){
                let roleIds = res.roles.map(itme=>itme.id)
                authInfo = await this.tkAuthRepository.createQueryBuilder("auth")
                    .leftJoin('auth.roles','r')
                    .where("auth.status=1 AND r.id in (:id)",{id:roleIds})
                    .orderBy({"auth.sort":"ASC"})
                    .getMany()
            }

        }

        let menu:tk_authority[] = authInfo.filter(itme=>itme.auth_type===1)
        let auth={}
        for(let i=0;i<authInfo.length;i++){
            auth[authInfo[i].signName] = authInfo[i].title
        }
        res['menu'] =oneToTree<tk_authority>(menu);
        res['auth'] =auth;
        return res;
       
    }
    /**
     * 验证当前操作是否有权限
     * @param userId 
     * @param authId 
     */
    async verfiyAutorify(userId:number,authId:string){
        let res = await this.tkUserRepository
        .createQueryBuilder('u')
        .leftJoinAndSelect('u.roles','r',"r.status = :status", { status: 1 })
        .where("u.id=:id",{id:userId})
        .getOne()
        if(!res){
            throw new BadRequestException('用户不存在')
        }
        if(res.user_type===1){
            return true;
        }
        if(res.user_type!==1&&res.status!==1){
            throw new BadRequestException('用户已经被禁用')
        }
        let roleIds = res.roles.map(itme=>itme.id)
        if(roleIds.length<1){
            throw new ForbiddenException('无权访问')
        }
        let authRes = await this.tkAuthRepository.createQueryBuilder("auth")
        .leftJoin('auth.roles','r')
        .where("auth.status=:status AND r.id IN (:roleIds) AND signName=:authId",{status:1,roleIds:roleIds,authId:authId})
        .getOne()
        if(authRes){
            return true
        }
        throw new ForbiddenException("无权访问");

    }
  
}