import { SavaTagDto } from './dto/create.dto';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { NoAuth } from 'src/common/decorators/noAuth.decorators';
import { FindTagListDto } from './dto/index.dto';
import { TagService } from './tag.service';
import { modifyStatusAllDto, veryfyIdsDto } from 'src/common/dto/index.dto';

@Controller('tag')
export class TabController {
    constructor(private tagService:TagService){}

    @Get()
    @NoAuth("ALL")
    findAll(@Query() query:FindTagListDto){
        return this.tagService.findList(query)
    }

    @Post("save")
    save(@Body() data:SavaTagDto){
        return this.tagService.save(data)
    }

    @Post("delete")
    delete(@Body() data:veryfyIdsDto){
        return this.tagService.delete(data.ids)
    }

     //修改状态
     @Post("modifyStatus")
     modifyStatus(@Body() data:modifyStatusAllDto){
         return this.tagService.modifyStatusUser(data)
     }

}
