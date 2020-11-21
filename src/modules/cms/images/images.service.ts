import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { modifyStatusAllDto } from 'src/common/dto/index.dto';
import { isToEmpty } from 'src/common/util';
import { tk_classify } from 'src/entity/tk_classify.entity';
import { tk_images } from 'src/entity/tk_images.entity';
import { Repository } from 'typeorm';
import { ClassifyService } from '../classify/classify.service';
import { SaveImagesDto, FindImagesListDto } from './dto/index.dto';

@Injectable()
export class ImagesService {
    constructor(
        private configService:ConfigService,
        private classifyService:ClassifyService,
        @InjectRepository(tk_images) private readonly tkImagesRepository: Repository<tk_images>,
    ){}
    
    async findList(data:FindImagesListDto){
       
        let page =(data.page||this.configService.get("page"))-1;
        let offset =data.offset|| this.configService.get("offset");
        let resBuilder =  this.tkImagesRepository
        .createQueryBuilder('a')
        .leftJoinAndMapMany('a.classify',tk_classify, 'classify', 'find_in_set(classify.id,a.cid)')
        .select(['a','classify.name','classify.id','classify.status','classify.pid'])
        .orderBy({"a.sort":"ASC","classify.pid":"ASC"}).skip(page*offset).take(offset)

        isToEmpty(data.classifyName)&&resBuilder.andWhere('classify.name =:cname ',{cname:data.classifyName})
        isToEmpty(data.cid)&&resBuilder.andWhere('classify.id =:cid ',{cid:data.cid})

        isToEmpty(data.startTime)&&resBuilder.where('a.createtime >= :startTime',{startTime:data.startTime+' 00:00:00'})
        isToEmpty(data.endTime)&&resBuilder.andWhere('a.createtime <= :endTime',{endTime:data.endTime+' 23:59:59'})
        isToEmpty(data.status)&&resBuilder.andWhere('a.status = :status ',{status:data.status})
        isToEmpty(data.title)&&resBuilder.andWhere(` a.title like '%${data.title}%' `)

        let res = await resBuilder.getManyAndCount()
        return {rows:res[0],total:res[1]};
    }

    async findDetail(id:number,status:number|string){
        let resBuilder =  await this.tkImagesRepository.createQueryBuilder("a")
        .leftJoinAndMapMany('a.classify',tk_classify, 'classify', 'find_in_set(classify.id,a.cid)')
        .select(['a','classify.name','classify.id','classify.status','classify.pid'])
        .orderBy({"classify.pid":"ASC"})
        .where("a.id=:id",{id:id})
        isToEmpty(status)&&resBuilder.andWhere('a.status = :status ',{status:status})
        let res = await resBuilder.getOne();
        return res||{}
    }

    async create(data:SaveImagesDto){
        delete data.id;
        let res =  await this.tkImagesRepository.createQueryBuilder("m")
        .insert().values(data).execute()
        return res.identifiers[0].id;
    }
    async update(data:SaveImagesDto){
        let saveData = new tk_images();
        saveData.urls=data.urls
        saveData.title=data.title
        saveData.remark=data.remark
        saveData.sort=data.sort
        saveData.status=data.status
        await this.tkImagesRepository.createQueryBuilder("r")
        .update(tk_images).set(data).where("id=:id",{id:data.id}).execute()
        return true
    }

      //单个/批量状态修改
      async modifyStatusUser(data:modifyStatusAllDto){
        let res = await this.tkImagesRepository.createQueryBuilder("i").update(tk_images)
            .set({ status: data.status}).where("id in (:id)", { id: data.ids.split(',') }).execute();
        if(res.affected>0){
            return res.affected
        }
        throw new BadRequestException('修改失败，该数据不存在')
    }
    //单个/批量 删除
    async delete(ids:string){
        let res = await this.tkImagesRepository.createQueryBuilder()
            .delete().where("id in (:id) AND status=2 ", { id: ids.split(',') }).execute();
        if(res.affected>0){
            return res.affected
        }
        throw new BadRequestException('删除失败，该数据不存在或者无法删除')
    }

}
