import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import {CreateUserDto,FindUserDto} from './dto/index.dto';
import { MannagerService } from './manager.service';
import {Permissions} from "src/shared/decorators/permissions.decorators"
import {  veryfyIdsDto, modifyStatusAllDto } from '@/shared/dto/index.dto';

@Controller('manager')
export class ManagerController {
    constructor(
        private mannagerService:MannagerService
    ){}

    @Get()
    @Permissions("per-lookManager")
    async find(@Query() query:FindUserDto,@Req() req){
        let {id,user_type} = req['user']
        if(user_type===1||user_type===2){
            return await this.mannagerService.find(query)
        }
        return await this.mannagerService.findChildUser(id,query)
       
    }
    /**
     * 
     * @param data 保存用户(创建和修改)
     * @param req 
     */
    @Post("save")
    @Permissions("per-saveManager")
    async addUser(@Body() data:CreateUserDto,@Req() req){
        //修改
        let loginUser = req['user']
        if(data.id){
            return await this.mannagerService.updataUser(data,loginUser)
        // 添加
        }else{
            return await this.mannagerService.createUser({status:1,user_type:3,...data,pid:loginUser.id},loginUser)
        } 
    }
    //修改状态
    @Post("modifyStatus")
    @Permissions("per-modifyStatusManager")
    modifyStatus(@Body() data:modifyStatusAllDto){
        return this.mannagerService.modifyStatusUser(data)
    }
    /**
     * 删除用户
     */
    @Post("delete")
    @Permissions("per-deleteManager")
    delete(@Body() data:veryfyIdsDto){
        return this.mannagerService.delete(data.ids)
    }
}
