import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { isToEmpty } from 'src/shared/util';
import { tk_message } from 'src/entity/tk_message.entity';
import { Repository } from 'typeorm';
import { SavaMessageDto } from './dto/index.dto';
import nodeXlsx from "node-xlsx"


@Injectable()
export class MessageService {
    constructor(
        private configService:ConfigService,
        @InjectRepository(tk_message) private readonly tkMessageRepository:Repository<tk_message>
    ){}

    async findList(data:any){
        
        let page =(data.page||this.configService.get("page"))-1;
        let offset =data.offset|| this.configService.get("offset");
        let build = await this.tkMessageRepository.createQueryBuilder('m')
        isToEmpty(data.startTime)&&build.where('m.createtime >= :startTime',{startTime:data.startTime+' 00:00:00'})
        isToEmpty(data.endTime)&&build.andWhere('m.createtime <= :endTime',{endTime:data.endTime+' 23:59:59'})
        if(data.isPage){
            let res = await build.getMany();
            return {rows:res,total:0};
        }else{
            let res = await build.skip(page*offset).take(offset).getManyAndCount();
            return {rows:res[0],total:res[1]};
        }
    }

    async save(data:SavaMessageDto){
        let res =  await this.tkMessageRepository.createQueryBuilder("m")
        .insert().values(data).execute()
        return res.identifiers[0].id;
    }
    async exportExce(data){
        let {rows}  = await this.findList(data);
        if(rows.length<1){
            throw new BadRequestException("暂无数据")
        }
        let colsHeader = ['邮箱','联系人','号码','地址','备注内容','提交时间']
        let colsFied = ['email','username','telephone','address','content','createtime']
        // type colsType = { caption:string, type:'string'}
        // let confCols:colsType[] = []
        // //生成表头
        // for(let i=0;i<colsHeader.length;i++){
        //     confCols.push({caption:data[i],type:'string'})
        // }
        //生成内容
        let towsData = [];
        towsData.push(colsHeader)
        for(let i =0;i<rows.length;i++){
            let towArr = [];
            for(let j=0;j<colsFied.length;j++){
                towArr.push(rows[i][colsFied[j]])
            }
            towsData.push(towArr)
        }
       
        let resBuffer = nodeXlsx.build([{name:"sheet1",data:towsData,options:{}}])
        return resBuffer
        // return {cols:cols,tows:towsData}
    }
}
