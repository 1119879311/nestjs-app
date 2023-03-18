import { modifyStatusDto } from 'src/shared/dto/modifyStatus.dto';
import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { tk_role } from 'src/entity/tk_role.entity';
import {  getManager, Repository } from 'typeorm';
import { FindRoleListDto, SaveRoleDto, TasksAuthorityDto } from './dto/index.dto';


@Injectable()
export class RoleService {
    constructor(
        private configService:ConfigService,
        @InjectRepository(tk_role) private readonly tkRoleRepository: Repository<tk_role>,
        ){}
    
    /**
     * 查列表
     * @param data 
     */
    async findList(data:FindRoleListDto){
        let page =(data.page||this.configService.get("page"))-1;
        let offset =data.offset|| this.configService.get("offset");
        let res = await this.tkRoleRepository
        .createQueryBuilder('u')
        .skip(page*offset)
        .take(offset)
        .getManyAndCount();
        return {rows:res[0],total:res[1]};
    }
    /**
     * 查详情
     * @param id 
     */
    async roleDetail(id:number){
        return await this.tkRoleRepository.createQueryBuilder("r")
        .leftJoinAndSelect("r.auths","auths")
        .where("r.id=:id",{id:id})
        .getOne()
    }

    async create(data:SaveRoleDto){
        let resFind = await this.tkRoleRepository.findOne({where:{name:data.name}})
        if(resFind){
            throw new HttpException('角色名称已经存在', HttpStatus.BAD_REQUEST)
        }
        
        let saveRole =new tk_role()
        saveRole.name = data.name
        saveRole.desc = data.desc
        saveRole.status = data.status
        saveRole.role_type = data.role_type
        saveRole.sort = saveRole.sort 
        saveRole.pid=1
        try {
            let res =  await this.tkRoleRepository.createQueryBuilder("r")
            .insert().into(tk_role).values(saveRole).execute()
            return res.identifiers[0].id;
        } catch (error) {
            throw new InternalServerErrorException("创建失败") 
        }
    }

    async update(data:SaveRoleDto){
        let resFind = await this.tkRoleRepository.find({where:[{id:data.id},{name:data.name}]})
        let redFilter = resFind.filter(itme=>itme.id===data.id)
        if(!redFilter[0]){
            throw new HttpException('该角色不存在', HttpStatus.BAD_REQUEST)
        }
        if(resFind.length>1){
            throw new HttpException('角色名已经重复存在', HttpStatus.BAD_REQUEST)
        }
        let saveRole =new tk_role()
        saveRole.name = data.name
        saveRole.desc = data.desc
        saveRole.status = data.status
        saveRole.role_type = data.role_type
        saveRole.sort = data.sort 
        try {
            await this.tkRoleRepository.createQueryBuilder("r")
            .update(tk_role).set(saveRole).where("id=:id",{id:data.id}).execute()
            return true
        } catch (error) {
            throw new InternalServerErrorException("更新失败") 
        }
       
    }
     // 修改状态
     async modifyStatus(data:modifyStatusDto){
        try {
            await this.tkRoleRepository.update(data.id,{status:data.status})
          
            return  null
        } catch (error) {
            throw new InternalServerErrorException("更新失败")
        }
    }
    /**
     *  删除状态为2(禁用) 
     * @param id 
     */
    async delete(id:number){ 
        let res = await this.tkRoleRepository.createQueryBuilder()
            .delete()
            .from(tk_role)
            .where("id = :id AND status=2", { id: id })
            .execute();
        if(res.affected>0){
            return null
        }
        throw new HttpException('删除失败，该角色不存在或者无法删除', HttpStatus.BAD_REQUEST)
    }
    async tasksAuthority(data:TasksAuthorityDto){

        let role = await this.tkRoleRepository.findOne({where:{id:data.id,},relations:['auths']})
        let addAuthIds = data.authIds.split(',').filter(itme=>itme)
     
        //第一种事务写法(隐式)
        return await getManager().transaction( async transactionalEntityManager => {
            await transactionalEntityManager.createQueryBuilder()
                .relation(tk_role, 'auths') // 指定載入relation
                .of(data.id) // 找對應的entity，可以是id或是queryed entity
                .addAndRemove(addAuthIds, role.auths.map(itme=>itme.id))
                
        })
        .then(()=> null )
        .catch(err=>{
            console.log(err)
            throw new InternalServerErrorException("分配资源失败") 
        });
        //第二种事务写法(显式)
        // let connection = getConnection();
        // const queryRunner = connection.createQueryRunner();
        // await queryRunner.connect();
        // await queryRunner.startTransaction();
        // try {
        //     await queryRunner.manager.createQueryBuilder()
        //         .relation(tk_role, 'auths') // 指定載入relation
        //         .of(data.id) // 找對應的entity，可以是id或是queryed entity
        //         .addAndRemove(data.authIds.split(','), role.auths.map(itme=>itme.id))
            
        //     await queryRunner.commitTransaction();
        //     return null;
        // } catch (error) {
        //     await queryRunner.rollbackTransaction();
        //     throw new InternalServerErrorException("分配资源失败") 
        // }
      
    }
}
