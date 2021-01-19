import { modifyStatusDto, veryfyIdDto } from 'src/shared/dto/index.dto';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthorityService } from './authority.service';
import { SaveAuthorityDto } from './dto/index.dto';
import {Permissions} from "src/shared/decorators/permissions.decorators"
@Controller('authority')
export class AuthorityController {
    constructor(
        private authorityService:AuthorityService
    ){}

    @Get()
    @Permissions("per-lookAuthority")
    async find(){
        return this.authorityService.find();
    }

    @Post("save")
    @Permissions("per-saveAuthority")
    async save(@Body() data:SaveAuthorityDto){
        return this.authorityService.save(data)
    }

    @Post("deleteMenu")
    @Permissions("per-deleteAuthority")
    async deleteMenu(@Body() data:veryfyIdDto){
        return this.authorityService.deleteMenu(data.id);
    }
    @Post("deleteAuth")
    @Permissions("per-deleteAuthority")
    async deleteAuth(@Body() data:veryfyIdDto){
        return this.authorityService.deleteAuth(data.id,2);
    }

    @Post("modifyStatus")
    @Permissions("per-modifyStatusAuthority")
    async modifyStatus(@Body() data:modifyStatusDto){
        return this.authorityService.modifyStatus(data)
    }

}
