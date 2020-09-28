
import { Controller, Get, Param, ParseIntPipe, Query, Redirect } from '@nestjs/common';
import { NoAuth } from 'src/common/decorators/noAuth.decorators';
import { CreateArticleDto } from './article.dto';
import {ArticleService} from "./article.service"

@Controller('article')
export class ArticleController {
    
    constructor(private articleService:ArticleService){}

    @Get(":id")
    findOne(@Param("id" , ParseIntPipe) id:number){
        return id;
    }
    @Get()
    @NoAuth("ALL")
    findAll(@Query() query:CreateArticleDto){
        console.log(query)
        return this.articleService.findAll()
    }
    @Get("add")
    @Redirect("/article")
    add(){
        console.log("重定向")
        return {url:"/api/add"};
    }
}
