import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { modifyStatusAllDto } from 'src/common/dto/index.dto';
import { isToEmpty } from 'src/common/util';
import { tk_tag } from 'src/entity/tk_tag.entity';
import { Repository } from 'typeorm';
import { FindTagListDto, SavaTagDto } from './dto/index.dto';

@Injectable()
export class TagService {
    
    constructor(
        private configService:ConfigService,
        @InjectRepository(tk_tag) private readonly tkTagRepository: Repository<tk_tag>,
    ){}

    
    async findList(data:FindTagListDto){

        let whereVal:any = {}
        let wherekey:string[]=[]

       
        if(isToEmpty(data.startTime)){
            wherekey.push(' t.createtime >= :startTime ')
            whereVal['startTime'] = data.startTime
        }

        if(isToEmpty(data.endTime)){
            wherekey.push(' t.createtime <= :endTime ')
            whereVal['endTime'] = data.endTime
        }
        if(isToEmpty(data.name)){
            wherekey.push(` t.name like '%${data.name}%' `)
        }
        let page =(data.page||this.configService.get("page"))-1;
        let offset =data.offset|| this.configService.get("offset");
        let resBuild = await this.tkTagRepository
        .createQueryBuilder('t')
        .where(wherekey.join(' AND '),whereVal)
        .orderBy({"t.sort":"DESC"})
        if(data.isPage){
            let res = await resBuild.getMany();
            return {rows:res,total:0};
        }else{
            let res = await resBuild.skip(page*offset).take(offset).getManyAndCount();
            return {rows:res[0],total:res[1]};
        }

        
    }

    async save(data:SavaTagDto){
        console.log(data)
        let saveData = new tk_tag()
        saveData.name=data.name
        saveData.sort=data.sort||10
        saveData.status=data.status||1
        try {
            if(data.id){
                let res =  await this.tkTagRepository.update({id:data.id},saveData)
                return res.affected;
            }else{
                let res =  await this.tkTagRepository.createQueryBuilder("a")
                .insert().values(saveData).execute()
                return res.identifiers[0].id;
            }
        } catch (error) {
            throw new BadRequestException("操作失败,标签名称可能重复")
        }

    }

    //单个/批量
    async modifyStatusUser(data:modifyStatusAllDto){
        let res = await this.tkTagRepository.createQueryBuilder("a").update(tk_tag)
            .set({ status: data.status}).where("id in (:id)", { id: data.ids.split(',') }).execute();
        if(res.affected>0){
            return res.affected
        }
        throw new BadRequestException('修改失败，该数据不存在')
    }
    //单个/批量
    async delete(ids:string){
        let res = await this.tkTagRepository.createQueryBuilder().delete()
            .where("id in (:id) AND status=2 ", { id: ids.split(',') }).execute();
        console.log(res)
        if(res.affected>0){
            return res.affected
        }
        throw new BadRequestException('删除失败，该数据不存在或者无法删除')
    }

}
