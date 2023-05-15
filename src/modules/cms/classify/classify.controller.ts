import { ClassifyService } from './classify.service';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { FindClassifyListDto, SavaClassifyDto } from './classify.dto';
import { modifyStatusAllDto, veryfyIdDto } from '@/shared/dto/index.dto';
import { Auth } from '@/shared/decorators/authorization.decorator';

@Controller('classify')
export class ClassifyController {
    constructor(
        private classifyService:ClassifyService
    ){}
    @Get()
  
    async findList(@Query() data:FindClassifyListDto){
        return this.classifyService.findList(data)
    }

    @Post("save")
    @Auth("per-saveClassify")
    async save(@Body() data:SavaClassifyDto){ 
        return this.classifyService.save(data)
    }

     //修改状态
     @Post("modifyStatus")
     @Auth("per-modifyStatusClassify")
     modifyStatus(@Body() data:modifyStatusAllDto){
        return this.classifyService.modifyStatusUser(data)
     }

    @Post("delete")
    @Auth("per-deleteClassify")
    async delete(@Body() data:veryfyIdDto){
        return this.classifyService.delete(data.id)
    }
}
