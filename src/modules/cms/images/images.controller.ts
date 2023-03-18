import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { NoAuth } from 'src/shared/decorators/noAuth.decorators';
import { modifyStatusAllDto, veryfyIdsDto } from 'src/shared/dto/index.dto';
import {  FindImagesListDto, SaveImagesDto } from './dto/index.dto';
import { ImagesService } from './images.service';
import {Permissions} from "src/shared/decorators/permissions.decorators"
@Controller('images')
export class ImagesController {
    constructor(
        private readonly imagesService:ImagesService
    ){}
    
    @Get()
    @NoAuth("ALL")
    findAll(@Query() query:FindImagesListDto){
        if(query.id){
            return this.imagesService.findDetail(query.id,query.status)
        }
        return this.imagesService.findList(query)
    }

    @Post("save")
    @Permissions("per-saveImage")
    async save(@Body() data:SaveImagesDto){ 
        if(data.id){
            return this.imagesService.update(data)
        }
        return this.imagesService.create(data)
    }

     //修改状态
     @Post("modifyStatus")
     @Permissions("per-modifyStatusImage")
     modifyStatus(@Body() data:modifyStatusAllDto){
         return this.imagesService.modifyStatusUser(data)
     }

    @Post("delete")
    @Permissions("per-deleteImage")
    async delete(@Body() data:veryfyIdsDto){
        return this.imagesService.delete(data.ids)
    }
}
