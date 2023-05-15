import { modifyStatusDto, veryfyIdDto } from '@/shared/dto/index.dto';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthorityService } from './authority.service';
import { Auth } from '@/shared/decorators/authorization.decorator';
import { SaveAuthorityDto } from './authority.dto';
@Controller('authority')
export class AuthorityController {
    constructor(
        private authorityService:AuthorityService
    ){}

    @Get()
    @Auth("per-lookAuthority")
    async find(){
        return this.authorityService.find();
    }

    @Post("save")
    @Auth("per-saveAuthority")
    async save(@Body() data:SaveAuthorityDto){
        return this.authorityService.save(data)
    }

    @Post("deleteMenu")
    @Auth("per-deleteAuthority")
    async deleteMenu(@Body() data:veryfyIdDto){
        return this.authorityService.deleteMenu(data.id);
    }
    @Post("deleteAuth")
    @Auth("per-deleteAuthority")
    async deleteAuth(@Body() data:veryfyIdDto){
        return this.authorityService.deleteAuth(data.id,2);
    }

    @Post("modifyStatus")
    @Auth("per-modifyStatusAuthority")
    async modifyStatus(@Body() data:modifyStatusDto){
        return this.authorityService.modifyStatus(data)
    }

}
