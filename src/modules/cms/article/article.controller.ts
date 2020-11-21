
import { Body, Controller, Get, Post, Query} from '@nestjs/common';
import { NoAuth } from 'src/common/decorators/noAuth.decorators';
import { createArticleDto, FindArtilceListDto } from './dto/index.dto';
import {ArticleService} from "./article.service"
import { modifyStatusAllDto, veryfyIdsDto } from 'src/common/dto/index.dto';


@Controller('article')
export class ArticleController {
    
    constructor(private articleService:ArticleService){}
  
    @Get()
    @NoAuth("ALL")
    findAll(@Query() query:FindArtilceListDto){
        if(query.id){
            return this.articleService.findDetail(query.id,query.status)
        }
        return this.articleService.findList(query)
    }
    @Post("save")
    save(@Body() data:createArticleDto){
        console.log("save",data)
        if(data.id){
            return this.articleService.update(data)
        }
        return this.articleService.create(data)
    }

    @Post("delete")
    delete(@Body() data:veryfyIdsDto){
        return this.articleService.delete(data.ids)
    }

     //修改状态
     @Post("modifyStatus")
     modifyStatus(@Body() data:modifyStatusAllDto){
         return this.articleService.modifyStatusUser(data)
     }

   
}
