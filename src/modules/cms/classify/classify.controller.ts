import { ClassifyService } from './classify.service';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { NoAuth } from '@/shared/decorators/noAuth.decorators';
import { FindClassifyListDto, SavaClassifyDto } from './dto/index.dto';
import { modifyStatusAllDto, veryfyIdDto } from '@/shared/dto/index.dto';
import {Permissions} from "src/shared/decorators/permissions.decorators"

@Controller('classify')
export class ClassifyController {
    constructor(
        private classifyService:ClassifyService
    ){}
    @Get()
    @NoAuth('ALL')
    async findList(@Query() data:FindClassifyListDto){
        return this.classifyService.findList(data)
    }

    @Post("save")
    @Permissions("per-saveClassify")
    async save(@Body() data:SavaClassifyDto){ 
        return this.classifyService.save(data)
    }

     //修改状态
     @Post("modifyStatus")
     @Permissions("per-modifyStatusClassify")
     modifyStatus(@Body() data:modifyStatusAllDto){
        return this.classifyService.modifyStatusUser(data)
     }

    @Post("delete")
    @Permissions("per-deleteClassify")
    async delete(@Body() data:veryfyIdDto){
        return this.classifyService.delete(data.id)
    }
}
