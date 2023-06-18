import { Body, CACHE_MANAGER, Controller, Get, Inject, Post, Query, Req } from '@nestjs/common';
import { MannagerService } from './manager.service';
// import {Permissions} from "src/shared/decorators/permissions.decorators"
import {  veryfyIdsDto, modifyStatusAllDto } from '@/shared/dto/index.dto';
import { Auth } from '@/shared/decorators/authorization.decorator';
import { CreateUserDto, FindUserDto } from './manager.dto';
import { getCacheAnthKey } from '@/shared/constant';
import {Cache} from "cache-manager"

@Controller('manager')
export class ManagerController {
    constructor(
        private mannagerService:MannagerService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ){}

    /**
     * @param query 
     * @param req 
     * @returns 
     */
    @Get()
    @Auth("per-lookManager")
    async find(@Query() query:FindUserDto,@Req() req){
        let {id,user_type,current_tenant} = req['user']
        let chacheUserInfo = await this.cacheManager.get(getCacheAnthKey(id))
        console.log("chacheUserInfo",chacheUserInfo)
        if(user_type===1){
            return await this.mannagerService.find(query)
        }
        return await this.mannagerService.findChildUser(id,current_tenant,query) 
       
    }
    /**
     * 
     * @param data 保存用户(创建和修改)
     * @param req 
     */
    @Post()
    async addUser(@Body() data:CreateUserDto,@Req() req){
        //修改
        // saveUser.operator_user_id =loginUser.operator_user_id;
        // saveUser.operator_tenant_id =loginUser.operator_tenant_id;
        let loginUser = req['user'] || {}
        if(data.id){
            return await this.mannagerService.updata(data,loginUser)
        // 添加
        }else{
            return await this.mannagerService.create(data,loginUser)
        } 
    }
    //修改状态
    @Post("modifyStatus")
    @Auth("per-modifyStatusManager")
    modifyStatus(@Body() data:modifyStatusAllDto){
        return this.mannagerService.modifyStatusUser(data)
    }
    /**
     * 删除用户
     */
    @Post("delete")
    @Auth("per-deleteManager")
    delete(@Body() data:veryfyIdsDto){
        return this.mannagerService.delete(data.ids)
    }
}
