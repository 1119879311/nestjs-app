import { SavaTagDto } from './dto/create.dto';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { NoAuth } from '@/shared/decorators/noAuth.decorators';
import { FindTagListDto } from './dto/index.dto';
import { TagService } from './tag.service';
import { modifyStatusAllDto, veryfyIdsDto } from '@/shared/dto/index.dto';
import {Permissions} from "src/shared/decorators/permissions.decorators"

@Controller('tag')
export class TabController {
    constructor(private tagService:TagService){}

    @Get()
    @NoAuth("ALL")
    findAll(@Query() query:FindTagListDto){
        return this.tagService.findList(query)
    }

    @Post("save")
    @Permissions("per-saveTag")
    save(@Body() data:SavaTagDto){
        return this.tagService.save(data)
    }

    @Post("delete")
    @Permissions("per-deleteTag")
    delete(@Body() data:veryfyIdsDto){
        return this.tagService.delete(data.ids)
    }

     //修改状态
     @Post("modifyStatus")
     @Permissions("per-modifyStatusTag")
     modifyStatus(@Body() data:modifyStatusAllDto){
         return this.tagService.modifyStatusUser(data)
     }

}
