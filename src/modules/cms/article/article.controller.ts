
import { Body, Controller, Get, Post, Query} from '@nestjs/common';
import { NoAuth } from '@/shared/decorators/noAuth.decorators';
import { createArticleDto, FindArtilceListDto } from './dto/index.dto';
import {ArticleService} from "./article.service"
import { modifyStatusAllDto, veryfyIdsDto } from '@/shared/dto/index.dto';
import {Permissions} from "src/shared/decorators/permissions.decorators"

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
    @Permissions("per-saveArticle")
    save(@Body() data:createArticleDto){
      
        if(data.id){
            return this.articleService.update(data)
        }
        return this.articleService.create(data)
    }

    @Post("delete")
    @Permissions("per-deleteArticle")
    delete(@Body() data:veryfyIdsDto){
        return this.articleService.delete(data.ids)
    }

     //修改状态
     @Post("modifyStatus")
    @Permissions("per-modifyStatusArticle")
     modifyStatus(@Body() data:modifyStatusAllDto){
         return this.articleService.modifyStatusUser(data)
     }

   
}
