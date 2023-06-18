import { SqlString } from '@/shared/util/sqlString';
import { AppLogger } from '@/shared/logger/logger.service';
import { tk_authority } from '@/entity/tk_authority.entity';
import { BadRequestException, CACHE_MANAGER, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Aes, MD5, nanoid, oneToTree } from "@/shared/util";
import { tk_user } from "@/entity/tk_user.entity";
import { DataSource, Repository } from "typeorm";
import {Cache} from "cache-manager"
import { tk_tenant } from '@/entity/tk_tenant.entity';
import { getCacheAnthKey } from '@/shared/constant';



@Injectable()
export class UserCenterService{
    constructor(
        private configService:ConfigService,
        private appLogger:AppLogger,
        private dataSource: DataSource,
        // private authService:AuthService,
        @InjectRepository(tk_user) private readonly tkUserRepository: Repository<tk_user>,
        @InjectRepository(tk_tenant) private readonly tkTenantRepository: Repository<tk_tenant>,

        // @InjectRepository(tk_role) private readonly tkRoleRepository: Repository<tk_role>,
        @InjectRepository(tk_authority) private readonly tkAuthRepository: Repository<tk_authority>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,


    ){}

    
    //修改当前用户密码
    async modifypwd(data:{id:number,password:string}){
        
        const user_key = nanoid()  // 重新生成user_key
        const aesPassword =  MD5(data.password, user_key)
        // let aesPassword = Aes.encryption(data.password,this.configService.get('password_secret'))
        let res = await this.tkUserRepository.createQueryBuilder("u").update(tk_user)
            .set({ password:aesPassword,user_key}).where("id =:id", { id: data.id }).execute();
        if(res.affected>0){
            return res.affected
        }
    }

    // 找当前用户的所属角色和权限
    async getManagerRole(id:number){
        
        let userFields = ['u.id','u.name','u.user_type','u.current_tenant','u.operator_user_id','u.operator_tenant_id','u.status']
        let result = await this.tkUserRepository
        .createQueryBuilder('u')
        .leftJoinAndSelect('u.roles','r',"r.status = :status", { status: 1 })
        .leftJoinAndMapOne('u.tenant',tk_tenant, 't', 'u.current_tenant=t.id')
        .select([...userFields,'r.id','r.name','r.status','r.role_type','t.id','t.name','t.status','t.tenant_type','t.data_access'])
        .where("u.id=:id and u.status=:status",{id,status:1})
        .getOne()
        if(!result){
            throw new BadRequestException('用户不存在或已被禁用')
        }
        let {user_type,status,roles} = result ;
        if(user_type!==1&&status!==1){
            throw new BadRequestException('用户已经被禁用')
        }
        let authInfo:tk_authority[]=[];
        // 超级用户可以获取所有权限
        let authQueryBuilder = this.tkAuthRepository.createQueryBuilder("auth").orderBy({"auth.sort":"ASC"})
        if(user_type===1){
            authQueryBuilder=authQueryBuilder.where('auth.status=1')
        //存在角色
        }else  if(Array.isArray(roles) && roles.length>0){ 
            authQueryBuilder=authQueryBuilder.leftJoin('auth.roles','r').where("auth.status=1 AND r.id in (:id)",{id:result.roles.map(itme=>itme.id)})
          
        }
        authInfo = await authQueryBuilder.getMany()
        let menu:tk_authority[] = authInfo.filter(itme=>itme.auth_type===1)
        let auth={}
        for(let i=0;i<authInfo.length;i++){
            auth[authInfo[i].code] = authInfo[i].name
        }
      
        result['menu'] =oneToTree<tk_authority>(menu);
        result['auth'] =auth;
      
        this.cacheManager.set(getCacheAnthKey(id),result,this.configService.get("cacheUserTime"))
        return result;
       
    }
    /**
     * 验证当前操作是否有权限
     * @param userId 
     * @param authName 
     */
    async verfiyAutorify(userId:number,authName:string){

        // 先读结果缓存,缓存1分钟
        let chacheKey = `auth_${userId}_${authName}`;
        let isVeryAuth = await this.cacheManager.get(chacheKey) 
        console.log("读结果缓存，isVeryAuth",chacheKey,isVeryAuth)
        if(isVeryAuth){
            return true
        }

        // 没有结果缓存，读用户信息的缓存进行判断
        let userChacheKey = getCacheAnthKey(userId)
        let chacheUserInfo:Record<string,any> = await this.cacheManager.get(userChacheKey)
        console.log("读缓存：",chacheUserInfo)

        // 用户信息有缓存,用当前用户信息缓存
        if(chacheUserInfo&&chacheUserInfo.user_type===1 || chacheUserInfo.auth[authName]) {
            // chacheUserInfo = await this.getManagerRole(userId)
            this.cacheManager.set(chacheKey,true,1000)
            return true;
        }
       
       // 没有缓存，进行查库
       let sql = `select DISTINCT u.id,a.code  from tk_authority a 
       INNER join tk_role_authority ra  on a.id=ra.a_id 
       INNER JOIN tk_role r on ra.r_id=r.id
       INNER JOIN tk_user_role ur on ur.r_id=r.id
       INNER JOIN tk_user u ON u.id=ur.u_id
       where  a.status=1 and r.status=1 and u.status=1  and u.id=? and a.code=?`
       let result:any[] = await this.dataSource.query(sql,[userId,authName])
       if(result && result.length){
        this.cacheManager.set(chacheKey,true,60000)
        return true
       }
       throw new ForbiddenException("无权访问");
    }
  
}