import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { modifyStatusAllDto, veryfyIdsDto } from '@/shared/dto/index.dto';
import {  FindImagesListDto, SaveImagesDto } from './images.dto';
import { ImagesService } from './images.service';
import { Auth } from '@/shared/decorators/authorization.decorator';
@Controller('images')
export class ImagesController {
    constructor(
        private readonly imagesService:ImagesService
    ){}
    
    @Get()
    findAll(@Query() query:FindImagesListDto){
        if(query.id){
            return this.imagesService.findDetail(query.id,query.status)
        }
        return this.imagesService.findList(query)
    }

    @Post("save")
    @Auth("per-saveImage")
    async save(@Body() data:SaveImagesDto){ 
        if(data.id){
            return this.imagesService.update(data)
        }
        return this.imagesService.create(data)
    }

     //修改状态
     @Post("modifyStatus")
     @Auth("per-modifyStatusImage")
     modifyStatus(@Body() data:modifyStatusAllDto){
         return this.imagesService.modifyStatusUser(data)
     }

    @Post("delete")
    @Auth("per-deleteImage")
    async delete(@Body() data:veryfyIdsDto){
        return this.imagesService.delete(data.ids)
    }
}
