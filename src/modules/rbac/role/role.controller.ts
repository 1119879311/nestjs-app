import { modifyStatusDto, veryfyIdDto } from '@/shared/dto/index.dto';
import { RoleService } from './role.service';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { FindRoleListDto, SaveRoleDto, TasksAuthorityDto } from './role.dto';
import { Auth } from '@/shared/decorators/authorization.decorator';
@Controller('role')
export class RoleController {
    constructor(
        private roleService:RoleService
    ){}

    @Get()
    @Auth("per-lookRole")
    async find(@Query() query:FindRoleListDto){
        if(query.id){
            return await this.roleService.roleDetail(query.id)
        }
        return await this.roleService.findList(query)
    }

    @Post()
    async save(@Body() data:SaveRoleDto){
        if(data.id){
            return await this.roleService.update(data)
        }
        return await this.roleService.create(data)

    }

    @Post("modifyStatus")
    @Auth("per-modifyStatusRole")
    async modifyStatus(@Body() data:modifyStatusDto){
        return await this.roleService.modifyStatus(data)
    }


    @Post("delete")
    @Auth("per-deleteRole")
    async delete(@Body() data:veryfyIdDto){
        return await this.roleService.delete(data.id)
    }

    @Post("tasksAuthority")
    @Auth("per-tasksAuthorityRole")
    async tasksAuthority(@Body() data:TasksAuthorityDto){
        return this.roleService.tasksAuthority(data)
    }

}
