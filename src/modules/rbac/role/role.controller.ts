import { modifyStatusDto, veryfyIdDto } from 'src/common/dto/index.dto';
import { RoleService } from './role.service';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { FindRoleListDto, SaveRoleDto, TasksAuthorityDto } from './dto/index.dto';
import {Permissions} from "src/common/decorators/permissions.decorators"
@Controller('role')
export class RoleController {
    constructor(
        private roleService:RoleService
    ){}

    @Get()
    @Permissions("per-lookRole")
    async find(@Query() query:FindRoleListDto){
        if(query.id){
            return await this.roleService.roleDetail(query.id)
        }
        return await this.roleService.findList(query)
    }

    @Post("save")
    @Permissions("per-saveRole")
    async save(@Body() data:SaveRoleDto){
        if(data.id){
            return await this.roleService.update(data)
        }
        return await this.roleService.create(data)

    }

    @Post("modifyStatus")
    @Permissions("per-modifyStatusRole")
    async modifyStatus(@Body() data:modifyStatusDto){
        return await this.roleService.modifyStatus(data)
    }


    @Post("delete")
    @Permissions("per-deleteRole")
    async delete(@Body() data:veryfyIdDto){
        return await this.roleService.delete(data.id)
    }

    @Post("tasksAuthority")
    @Permissions("per-tasksAuthorityRole")
    async tasksAuthority(@Body() data:TasksAuthorityDto){
        return this.roleService.tasksAuthority(data)
    }

}
