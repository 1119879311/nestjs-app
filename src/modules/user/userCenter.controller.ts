import { modifypwdDto } from './dto/modifypwd.dto';
import { Body, Controller,  Post, Query, Req } from "@nestjs/common";

import { UserCenterService } from './userCenter.service';

@Controller('managerCenter')
export class UserCenterController{
    constructor(
        private userCenterService:UserCenterService
    ){}
    /**
     * 获取用户的权限和菜单信息
     */
    
    @Post("getManagerRole")
    getManagerRole(@Req() req){
        return this.userCenterService.getManagerRole(req['user'].id)
    }

    /**
     * 获取修改当前登录用户的登录密码
     */
    @Post("modifypwd")
    async modifypwd(@Body() data:modifypwdDto,@Req() req){
        let {id} = req['user']
        return await this.userCenterService.modifypwd({id,password:data.password})
    }

    

}