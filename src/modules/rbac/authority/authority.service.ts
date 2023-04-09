import { modifyStatusDto } from '@/shared/dto/index.dto';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { oneToTree } from '@/shared/util';
import { tk_authority } from '@/entity/tk_authority.entity';
import { In, Repository } from 'typeorm';
import { SaveAuthorityDto } from './dto/index.dto';

@Injectable()
export class AuthorityService {
    constructor(
        @InjectRepository(tk_authority) private readonly tkAuthorityRepository: Repository<tk_authority>,
    ){}
   
    async find(){
        let res = await this.tkAuthorityRepository.find({order:{"sort":"ASC"}});
        return oneToTree<tk_authority>(res)
    }

   /**
    * 
    * @param data 
    */
    async save(data:SaveAuthorityDto){
        let saveData = new tk_authority()
        saveData.name=data.name
        saveData.code = data.code
        saveData.url = data.url
        saveData.auth_type=data.auth_type
        saveData.pid =data.pid
        data.sort?saveData.sort=data.sort:''
        data.status?saveData.status=data.status:''
        try {
            if(data.id){
                await this.tkAuthorityRepository.createQueryBuilder("r")
                .update(tk_authority).set(saveData).where("id=:id",{id:data.id}).execute()
                return true
            }else{
    
                saveData.id = data.id
                let res =  await this.tkAuthorityRepository.createQueryBuilder("a")
                .insert().into(tk_authority).values(saveData).execute()
                return res.identifiers[0].id;
            }
        } catch (error) {
            throw new BadRequestException("保存失败，唯一标识signName字段可能重复")
        } 
    }

   /**
    * 
    * @param id 
    */
    async deleteMenu(id:number){
        let resFind = await this.tkAuthorityRepository.find({where:[{id:id,auth_type:In([1,3])},{pid:id}]})
        if(resFind.length<1){
            throw new BadRequestException("删除失败，该菜单不存在")
        }
        if(resFind.length>1){
            throw new BadRequestException("删除失败，该菜单存在子菜单，无法删除")
        }
        return await this.deleteAuth(id,1);

    }
    /**
     * 
     * @param id 
     * @param auth_type 
     */
    async deleteAuth(id:number,auth_type:number){
        let res = await this.tkAuthorityRepository.createQueryBuilder()
            .delete()
            .from(tk_authority)
            .where("id = :id AND status=2 AND auth_type=:auth_type", { id ,auth_type})
            .execute();
        if(res.affected>0){
            return null
        }
        throw new BadRequestException("删除失败，该资源不存在或者状态处于正常无法删除")
    }
    /**
     * 
     * @param data 
     */
    async modifyStatus(data:modifyStatusDto){
    //    let res =  await this.tkAuthorityRepository.save([{id:data.id,status:data.status}])
    //    return res;
        await this.tkAuthorityRepository.update(data.id,{status:data.status}) 
        return  null
    }

}
