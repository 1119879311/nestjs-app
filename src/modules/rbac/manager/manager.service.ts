import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { modifyStatusAllDto } from '@/shared/dto/modifyStatus.dto';
import { Aes,  MD5,  isToEmpty, nanoid } from '@/shared/util';
import {  BuildLimit, BuildWhere, BuilSql } from '@/shared/util/dbsql';
import { tk_role } from '@/entity/tk_role.entity';
import { tk_user } from '@/entity/tk_user.entity';
import { DataSource, In, Repository } from 'typeorm';
import { CreateUserDto,FindUserDto } from './manager.dto';
import { tk_tenant } from '@/entity/tk_tenant.entity';
@Injectable()
export class MannagerService {
    constructor(
        private configService:ConfigService,
        private dataSource: DataSource,
        @InjectRepository(tk_user) private readonly tkUserRepository: Repository<tk_user>,
        @InjectRepository(tk_role) private readonly tkRoleRepository: Repository<tk_role>,
        @InjectRepository(tk_tenant) private readonly tkTenantRepository: Repository<tk_tenant>

        ){
            
        }

    /**
     * 用户列表
     * @param data FindUserDto
     * SELECT 
     * f1.id,f1.name,f1.user_type,f1.pid,up.name as pname,GROUP_CONCAT(ur.r_id) as role_id,GROUP_CONCAT(r.name) as role_name 
     *  FROM ( SELECT * FROM tk_user  ORDER BY pid, id DESC ) f1
     *  left join tk_user_role ur on ur.u_id=id 
     *  left join tk_role r on r.id=ur.r_id
     *  left join tk_user up on f1.pid=up.id, 
     * (SELECT @pv :=1) initialisation
     *  WHERE (FIND_IN_SET(f1.pid,@pv)>0 And @pv := concat(@pv, ',', f1.id)) or f1.id=1
     *  group by f1.id;
     */
    async find(data:FindUserDto){
      
        let page =(data.page||this.configService.get("page"))-1;
        let offset =data.offset|| this.configService.get("offset");
        let resBuilder = await this.tkUserRepository
        .createQueryBuilder('u')
        .leftJoinAndSelect('u.roles','roles')
        .leftJoinAndMapOne('u.parent',tk_user, 'parent', 'u.operator_user_id=parent.id')
        .select(['u','parent.id','parent.name','parent.status','roles.name','roles.id','roles.role_type','roles.status'])
        .skip(page*offset)
        .take(offset)
        .orderBy({"u.user_type":"ASC",'parent.name':'DESC','u.id':'DESC'})
        
        isToEmpty(data.startTime)&&resBuilder.where('u.createtime >= :startTime',{startTime:data.startTime+' 00:00:00'})
        isToEmpty(data.endTime)&&resBuilder.andWhere('u.createtime <= :endTime',{endTime:data.endTime+' 23:59:59'})
        isToEmpty(data.status)&&resBuilder.andWhere('u.status = :status ',{status:data.status})
        isToEmpty(data.name)&&resBuilder.andWhere(` u.name like '%${data.name}%' `)
       
        let res = await resBuilder.getManyAndCount();

        return {rows:res[0],total:res[1]};
    }
    async findChildUser(loginId:number,current_tenant:number,data:FindUserDto){

        let page =(data.page||this.configService.get("page"))-1;
        let offset =data.offset|| this.configService.get("offset");

        let buildWhere = new BuildWhere();
        isToEmpty(data.startTime)&&buildWhere.andWhere('u.createtime >= ?',data.startTime+' 00:00:00')
        isToEmpty(data.endTime)&&buildWhere.andWhere('u.createtime <= ?',data.endTime+' 23:59:59')
        isToEmpty(data.status)&&buildWhere.andWhere('u.status = ? ',data.status)
        isToEmpty(data.name)&&buildWhere.andWhere(` u.name like '%${data.name}%' `)

        let sql =`SELECT 
            u.*,up.name as pname,up.status pstatus,GROUP_CONCAT(ur.r_id) as role_id,GROUP_CONCAT(r.name) as role_name ,GROUP_CONCAT(r.status) as role_status
            FROM ( SELECT * FROM tk_user  ORDER BY operator_user_id, id DESC ) u
            left join tk_user_role ur on ur.u_id=id 
            left join tk_role r on r.id=ur.r_id
            left join tk_user up on u.operator_user_id=up.id, 
            (SELECT @pv :=?) initialisation
            WHERE (FIND_IN_SET(u.operator_user_id,@pv)>0 And @pv := concat(@pv, ',', u.id)) or u.id=?
            group by u.id :having :limit`
        let buildSql = new BuilSql(sql)
        let comSql = buildSql.replaceField('having',buildWhere.getWhereStr()).getSql();
        let resSql = buildSql.replaceField('limit',"?,?").getSql();
        let res:any[] = await this.dataSource.query(resSql,[loginId,loginId,...buildWhere.getWhereData(),...BuildLimit(page,offset)])
        
        res =res.map(itme=>{
            if(itme.role_id){
                let rid = itme.role_id.split(',');
                let rname = itme.role_name&&itme.role_name.split(',')||[];
                let rstatus = itme.role_status&&itme.role_status.split(',')||[];
                itme.roles = rid.map((val,index)=> { return {  "id": Number(val), "name": rname[index],"status": Number(rstatus[index])}  })
            }else{
                itme.roles = [];
            }
            itme.parent = itme.pname?{id:itme.operator_user_id,name:itme.pname,status:itme.pstatus}:null;
            itme.password='';
            return itme
            
        })

        let countSql = ` select count(*) count from ( ${comSql} ) c`;
        let countBuildSql = new BuilSql(countSql).replaceField('limit').getSql();
        let resCount = await this.dataSource.query(countBuildSql,[loginId,loginId,...buildWhere.getWhereData()])

        return {rows:res,total:resCount[0].count};
        
    }
    /**
     *  创建用户
     * @param data CreateUserDto
     */
    async create(data:CreateUserDto,loginUser?:tk_user){
        // 用户类型 use_type 值最小，类型级别越高
        if(loginUser.user_type>data.user_type){
            throw new BadRequestException("你无法创建该类型的用户")
        }
        let resFind = await this.tkUserRepository.findOne({where:{name:data.name}})
        if(resFind){
            throw new HttpException('账号已经存在', HttpStatus.BAD_REQUEST)
        }
        let saveUser = new tk_user()
        saveUser.name = data.name;
        saveUser.user_key = nanoid()
        saveUser.password =  MD5(data.password, saveUser.user_key)// Aes.encryption(data.password,this.configService.get('password_secret'))
        saveUser.email = data.email
        saveUser.contact = data.contact
        saveUser.status = data.status
        saveUser.user_type = data.user_type
        saveUser.operator_user_id =loginUser.operator_user_id;
        saveUser.operator_tenant_id =loginUser.operator_tenant_id;
        if(data.roleIds){
            saveUser.roles = await this.tkRoleRepository.find({where:{id:In(data.roleIds.split(","))}})
        }
        if(data.tenantIds){
            const tenantIds = data.tenantIds.split(",")
            saveUser.current_tenant = Number(tenantIds[0])
            saveUser.tenants = await this.tkTenantRepository.find({where:{id:In(tenantIds)}})
        }
        let res = await this.tkUserRepository.save([saveUser])
        return res
       
    }
    //更新
    async updata(data:CreateUserDto,loginUser?:tk_user){
       
        let resFind = await this.tkUserRepository.createQueryBuilder("u").select(['u.name','u.id','u.user_type']).where("u.name = :name OR u.id =:id",{name:data.name,id:data.id}).getMany();
        let redFilter = resFind.filter(itme=>itme.id===data.id)
        if(!redFilter[0]){
            throw new HttpException('该账号不存在', HttpStatus.BAD_REQUEST)
        }
        if(loginUser.user_type!==1&&redFilter[0].user_type===1){
            throw new BadRequestException("你无法修改该用户信息")
        }
        if(resFind.length>1){
            throw new HttpException('账号名已经重复存在', HttpStatus.BAD_REQUEST)
        }
        let saveUser = new tk_user()
        saveUser.id = data.id
        saveUser.name=data.name
        saveUser.email= data.email
        saveUser.contact = data.contact
        saveUser.status=data.status
        saveUser.user_type=data.user_type
        saveUser.roles = data.roleIds?await this.tkRoleRepository.findBy({id:In(data.roleIds.split(','))}):[]
        let res = await this.tkUserRepository.save([saveUser])
        return res[0].id
    }
    

    getWhere(loginUser?:tk_user){
        if(!loginUser || loginUser.user_type===1) return {}
        if(loginUser.tenants){}
    }

    // 修改状态
    async modifyStatusUser(data:modifyStatusAllDto){
        let res = await this.tkUserRepository.createQueryBuilder("a").update(tk_user)
            .set({ status: data.status}).where("id in (:id)", { id: data.ids.split(',') }).andWhere({}).execute();
        if(res.affected>0){
            return res.affected
        }
        throw new BadRequestException('修改失败，该数据不存在')
    }
    /**
     *  删除状态为2(禁用) 且用户类型不为1(系统用户)
     * @param id 用户id
     */
    async delete(ids:string){ 
        let res = await this.tkUserRepository.createQueryBuilder().delete()
            .where("id in (:id) AND status=2 AND user_type!=1", { id: ids.split(',') }).execute();
        if(res.affected>0){
            return null
        }
        throw new HttpException('删除失败，该用户不存在或者无法删除', HttpStatus.BAD_REQUEST)
    }
}