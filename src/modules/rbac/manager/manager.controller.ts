import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { MannagerService } from './manager.service';
// import {Permissions} from "src/shared/decorators/permissions.decorators"
import {  veryfyIdsDto, modifyStatusAllDto } from '@/shared/dto/index.dto';
import { Auth } from '@/shared/decorators/authorization.decorator';
import { CreateUserDto, FindUserDto } from './manager.dto';


@Controller('manager')
export class ManagerController {
    constructor(
        private mannagerService:MannagerService
    ){}

    /**
     *  超级用户可以查所有数据
     *  其他用户根据所属空间 类型查,
     * @param query 
     * @param req 
     * @returns 
     */
    @Get()
    @Auth("per-lookManager")
    async find(@Query() query:FindUserDto,@Req() req){
        let {id,user_type,current_tenant} = req['user']
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
