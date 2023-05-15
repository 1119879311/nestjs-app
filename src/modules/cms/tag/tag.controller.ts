import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TagService } from './tag.service';
import { modifyStatusAllDto, veryfyIdsDto } from '@/shared/dto/index.dto';
import { FindTagListDto, SavaTagDto } from './tag.dto';
import { Auth } from '@/shared/decorators/authorization.decorator';

@Controller('tag')
export class TabController {
    constructor(private tagService:TagService){}

    @Get()
    findAll(@Query() query:FindTagListDto){
        return this.tagService.findList(query)
    }

    @Post("save")
    @Auth("per-saveTag")
    save(@Body() data:SavaTagDto){
        return this.tagService.save(data)
    }

    @Post("delete")
    @Auth("per-deleteTag")
    delete(@Body() data:veryfyIdsDto){
        return this.tagService.delete(data.ids)
    }

     //修改状态
     @Post("modifyStatus")
     @Auth("per-modifyStatusTag")
     modifyStatus(@Body() data:modifyStatusAllDto){
         return this.tagService.modifyStatusUser(data)
     }

}
