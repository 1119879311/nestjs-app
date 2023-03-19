import { tk_classify } from '@/entity/tk_classify.entity';
import { tk_article } from '@/entity/tk_article.entity';
import {  BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { createArticleDto, FindArtilceListDto } from './dto/index.dto';
import { isToEmpty } from '@/shared/util';
import { modifyStatusAllDto } from '@/shared/dto/index.dto';
import { ClassifyService } from '../classify/classify.service';

@Injectable()
export class ArticleService {
    constructor(
        private configService:ConfigService,
        private dataSource: DataSource,
        private classifyService:ClassifyService,
        @InjectRepository(tk_article) private readonly tkArticleRepository: Repository<tk_article>,
        // @InjectRepository(tk_tag) private readonly tkTagRepository: Repository<tk_tag>,

        ){}

    async findList(data:FindArtilceListDto){
       
        let page =(data.page||this.configService.get("page"))-1;
        let offset =data.offset|| this.configService.get("offset");
        let resBuilder =  this.tkArticleRepository
        .createQueryBuilder('a')
        .leftJoinAndMapOne('a.classify',tk_classify, 'classify', 'a.cid=classify.id')
        .select(['a','classify.name','classify.id','classify.status'])
        .orderBy({"a.sort":"ASC"}).skip(page*offset).take(offset)

        isToEmpty(data.tabId)&&resBuilder.andWhere('tabs.id = :tabId',{tabId:data.tabId})

        isToEmpty(data.classifyName)&&resBuilder.andWhere('classify.id IN (:cname) ',{cname:await this.classifyService.findClassifyChild(data.classifyName,'name')})
        isToEmpty(data.cid)&&resBuilder.andWhere('classify.id IN (:cid) ',{cid:await this.classifyService.findClassifyChild(data.cid)})

        isToEmpty(data.startTime)&&resBuilder.where('a.createtime >= :startTime',{startTime:data.startTime+' 00:00:00'})
        isToEmpty(data.endTime)&&resBuilder.andWhere('a.createtime <= :endTime',{endTime:data.endTime+' 23:59:59'})
        isToEmpty(data.status)&&resBuilder.andWhere('a.status = :status ',{status:data.status})
        isToEmpty(data.title)&&resBuilder.andWhere(` a.title like '%${data.title}%' `)

        let res:unknown
        if(isToEmpty(data.tabId)){
            res = await resBuilder.leftJoin("a.tags","tags").getManyAndCount();
        }else{
            res = await resBuilder.getManyAndCount();
        }
       
        return {rows:res[0],total:res[1]};
    }
    async findDetail(id:number,status:number|string){
        let resBuilder =  await this.tkArticleRepository.createQueryBuilder("a")
        .leftJoinAndMapOne('a.classify',tk_classify, 'classify', 'a.cid=classify.id')
        .leftJoinAndSelect("a.tags","tags")
        .addSelect('a.content')
        .where("a.id=:id",{id:id})
        isToEmpty(status)&&resBuilder.andWhere('a.status = :status ',{status:status})
        let res = await resBuilder.getOne();
        return res||{}
    }

    async create(data:createArticleDto){
        let saveData = new tk_article()
        saveData.title=data.title
        saveData.content=data.content
        saveData.remark=data.remark
        saveData.thumimg = data.thumimg
        saveData.cid = data.cid||null
        saveData.sort = data.sort||10
        saveData.status=data.status||1;
        return await this.dataSource.transaction( async transactionalEntityManager => {
            let addRes =  await transactionalEntityManager.createQueryBuilder()
            .insert().into(tk_article).values(saveData).execute()
            let insertId = addRes.identifiers[0].id
            let addTabIds = data.tagIds?.split(',').filter(itme=>itme)||[]
            await transactionalEntityManager.createQueryBuilder()
                .relation(tk_article,'tags').of(insertId)
                .add(addTabIds)
            return insertId    
        })
        .then(res=> res )
        .catch(err=>{
            throw new InternalServerErrorException("新增失败") 
        });  
    }
    async update(data:createArticleDto){
       
            //更新
            const resTabs = await this.tkArticleRepository.findOne({where:{id:data.id},relations: ['tags']});
            let saveData = new tk_article()
            saveData.title=data.title
            saveData.remark=data.remark
            saveData.content=data.content
            saveData.thumimg = data.thumimg||resTabs.thumimg
            saveData.cid = data.cid||resTabs.cid
            saveData.sort = data.sort||resTabs.sort
            saveData.status=data.status||resTabs.status;

            let  newId = data.tagIds?.split(',').filter(itme=>itme)||[];//[1,4]
            let oldId = resTabs.tags.map(itme=>itme.id) ;////[1,3]
            let addIds = newId.filter(itme=>!oldId.includes(Number(itme)))
            
            let removeIds =oldId.filter(itme=>!newId.includes(itme+''))
           
            return await this.dataSource.transaction( async transactionalEntityManager => {
                await transactionalEntityManager.createQueryBuilder()
                .update(tk_article).set(saveData).where("id =:id",{id:data.id}).execute();
                //更新关联
                await transactionalEntityManager.createQueryBuilder()
                .relation(tk_article,'tags').of(data.id)
                .addAndRemove(addIds,removeIds)
                    
            })
            .then(()=> null )
            .catch(err=>{
                throw new InternalServerErrorException("更新失败") 
            });
    }

     //单个/批量状态修改
    async modifyStatusUser(data:modifyStatusAllDto){
        let res = await this.tkArticleRepository.createQueryBuilder("a").update(tk_article)
            .set({ status: data.status}).where("id in (:id)", { id: data.ids.split(',') }).execute();
        if(res.affected>0){
            return res.affected
        }
        throw new BadRequestException('修改失败，该数据不存在')
    }
    //单个/批量 删除
    async delete(ids:string){
        let res = await this.tkArticleRepository.createQueryBuilder()
            .delete()
            .where("id in (:id) AND status=2 ", { id: ids.split(',') })
            .execute();
        if(res.affected>0){
            return res.affected
        }
        throw new BadRequestException('删除失败，该数据不存在或者无法删除')
    }



}
