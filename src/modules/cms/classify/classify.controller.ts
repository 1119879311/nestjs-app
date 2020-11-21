import { ClassifyService } from './classify.service';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { NoAuth } from 'src/common/decorators/noAuth.decorators';
import { FindClassifyListDto, SavaClassifyDto } from './dto/index.dto';
import { modifyStatusAllDto, veryfyIdDto, veryfyIdsDto } from 'src/common/dto/index.dto';

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
    async save(@Body() data:SavaClassifyDto){ 
        return this.classifyService.save(data)
    }

     //修改状态
     @Post("modifyStatus")
     modifyStatus(@Body() data:modifyStatusAllDto){
         return this.classifyService.modifyStatusUser(data)
     }

    @Post("delete")
    async delete(@Body() data:veryfyIdDto){
        return this.classifyService.delete(data.id)
    }
}
