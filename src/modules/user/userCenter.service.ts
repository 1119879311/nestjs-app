import { AppLogger } from '@/shared/logger/logger.service';
import { tk_authority } from '@/entity/tk_authority.entity';
import { BadRequestException, CACHE_MANAGER, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Aes, oneToTree } from "src/shared/util";
import { tk_user } from "src/entity/tk_user.entity";
import { Repository } from "typeorm";
import {Cache} from "cache-manager"
import { tk_tenant } from '@/entity/tk_tenant.entity';



@Injectable()
export class UserCenterService{
    constructor(
        private configService:ConfigService,
        private appLogger:AppLogger,
        // private authService:AuthService,
        @InjectRepository(tk_user) private readonly tkUserRepository: Repository<tk_user>,
        @InjectRepository(tk_tenant) private readonly tkTenantRepository: Repository<tk_tenant>,

        // @InjectRepository(tk_role) private readonly tkRoleRepository: Repository<tk_role>,
        @InjectRepository(tk_authority) private readonly tkAuthRepository: Repository<tk_authority>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,


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
        let userChacheKey = `user_info_${id}`
    //     let chache = await this.cacheManager.get(userChacheKey)
    //    console.log("读缓存：",chache)
    //     if(chache) return chache

        let userFields = ['u.id','u.name','u.user_type','u.current_tenant','u.operator_user_id','u.operator_tenant_id','u.status']
        let res = await this.tkUserRepository
        .createQueryBuilder('u')
        .leftJoinAndSelect('u.roles','r',"r.status = :status", { status: 1 })
        .leftJoinAndMapOne('u.tenant',tk_tenant, 't', 'u.current_tenant=t.id')
        .select([...userFields,'r.id','r.name','r.status','r.role_type','t.id','t.name','t.status','t.tenant_type','t.data_access'])
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
            authInfo = await this.tkAuthRepository.createQueryBuilder("auth").orderBy({"auth.sort":"ASC"}).where('auth.status=1 AND auth.auth_type=1').getMany()
        
        }else  if(res.roles.length>0){ //存在角色
       
            let roleIds = res.roles.map(itme=>itme.id)
            authInfo = await this.tkAuthRepository.createQueryBuilder("auth")
                .leftJoin('auth.roles','r')
                .where("auth.status=1 AND r.id in (:id)",{id:roleIds})
                .orderBy({"auth.sort":"ASC"})
                .getMany()
        }

        let menu:tk_authority[] = authInfo.filter(itme=>itme.auth_type===1)
        let auth={}
        for(let i=0;i<authInfo.length;i++){
            auth[authInfo[i].code] = authInfo[i].name
        }
        res['menu'] =oneToTree<tk_authority>(menu);
        res['auth'] =auth;
        console.log("更新缓存：",res)
        this.cacheManager.set(userChacheKey,res,1000*60*60)
        return res;
       
    }
    /**
     * 验证当前操作是否有权限
     * @param userId 
     * @param authName 
     */
    async verfiyAutorify(userId:number,authName:string){

        // 先读缓存
        // 用户信息：四部分： 基本信息： 角色， 权限, 空间
        /**
         * 基本信息： id，user_type,name,status,current_tenant
         * roles:[]
         * auth:{}
         */
        let userChacheKey = `user_info_${userId}`
        let chacheUserInfo:Record<string,any> = await this.cacheManager.get(userChacheKey)
        console.log("读缓存：",chacheUserInfo)
        if( !chacheUserInfo) {
            chacheUserInfo = await this.getManagerRole(userId)
        }
        //  chacheUserInfo:Record<string,any> = await this.getManagerRole(userId)
        if(chacheUserInfo.user_type===1 || chacheUserInfo.auth[authName]){
            return true;
        }

        throw new ForbiddenException("无权访问");

        // let userChacheKey = `user_info_${userId}`
        //  chacheUserInfo:Record<string,any> = await this.cacheManager.store.get(userChacheKey)



        console.log("读取缓存：chacheUserInfo",chacheUserInfo)
        if(!chacheUserInfo){
            // 缓存数据判定，先判定用户类型，然后角色， 然后权限
            chacheUserInfo = await this.tkUserRepository
            .createQueryBuilder('u')
            .leftJoinAndSelect('u.roles','r',"r.status = :status", { status: 1 })
            .where("u.id=:id",{id:userId})
            .getOne()
        }
       
        if(!chacheUserInfo){
           
            this.cacheManager.del(userChacheKey);// 用户不存在，直接删除缓存
            throw new BadRequestException('用户不存在，请联系管理员')
        }
        if(chacheUserInfo.user_type===1){
            return true;
        }
        if(chacheUserInfo.user_type!==1&&chacheUserInfo.status!==1){
            throw new BadRequestException('用户已经被禁用，请联系管理员')
        }
        if(chacheUserInfo.roles.length<1){
            throw new ForbiddenException('无权访问')
        }
        // 存在属于缓存数据
        if(chacheUserInfo.auth && chacheUserInfo.auth[authName]){
            return true      
        }

         // 存在缓存 但是 没权限
        if(chacheUserInfo.auth && chacheUserInfo.auth[authName]===false){
            throw new ForbiddenException("无权访问");
        }
    
        // 查角色
        let roleIds = chacheUserInfo.roles.map(itme=>itme.id)
        // 查权限
        let authRes = await this.tkAuthRepository.createQueryBuilder("auth")
        .leftJoin('auth.roles','r')
        .where("auth.status=:status AND r.id IN (:roleIds) AND code=:authName",{status:1,roleIds:roleIds,authName:authName})
        .getOne()
        if(!chacheUserInfo.auth) chacheUserInfo.auth={}
        chacheUserInfo.auth[authName] =authRes? true :false
        console.log("更新缓存：chacheUserInfo",chacheUserInfo)
         this.cacheManager.store.set(userChacheKey,chacheUserInfo,60*60*12)
        if(authRes) {
            return true
        }
       
        throw new ForbiddenException("无权访问");

    }
  
}