
import { Body, Controller, Get, Post, Query} from '@nestjs/common';
import { NoAuth } from '@/shared/decorators/noAuth.decorators';
import { createArticleDto, FindArtilceListDto } from './dto/index.dto';
import {ArticleService} from "./article.service"
import { modifyStatusAllDto, veryfyIdsDto } from '@/shared/dto/index.dto';
import {Permissions} from "src/shared/decorators/permissions.decorators"
import { Auth, Public } from '@/shared/decorators/authorization.decorator';

@Controller('article')
export class ArticleController {
    
    constructor(private articleService:ArticleService){}
  
   
    @Get()
    findAll(@Query() query:FindArtilceListDto){
        if(query.id){
            return this.articleService.findDetail(query.id,query.status)
        }
        return this.articleService.findList(query)
    }
    @Post("save")
    @Auth("per-saveArticle")
    save(@Body() data:createArticleDto){
      
        if(data.id){
            return this.articleService.update(data)
        }
        return this.articleService.create(data)
    }

    @Auth("per-deleteArticle")
    @Post("delete")
    delete(@Body() data:veryfyIdsDto){
        return this.articleService.delete(data.ids)
    }

     //修改状态
    @Auth("per-modifyStatusArticle")
    @Post("modifyStatus")
     modifyStatus(@Body() data:modifyStatusAllDto){
         return this.articleService.modifyStatusUser(data)
     }

   
}
