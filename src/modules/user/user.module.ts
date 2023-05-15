
import { UserLoginService } from './userLogin.service';
import { UserCenterController } from './userCenter.controller';
import { UserLoginController } from './userLogin.controller';
import {  forwardRef, Module } from "@nestjs/common";
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCenterService } from './userCenter.service';
import { tk_tenant } from '@/entity/tk_tenant.entity';
import { tk_user } from '@/entity/tk_user.entity';
import { tk_authority } from '@/entity/tk_authority.entity';
import { tk_role } from '@/entity/tk_role.entity';

@Module({
    imports:[
        forwardRef(()=>AuthModule),
        TypeOrmModule.forFeature([tk_user,tk_role,tk_authority,tk_tenant]),
    ],
    controllers:[UserLoginController,UserCenterController],
    providers:[UserLoginService,UserCenterService],
    exports:[UserCenterService]
})
export class UserModule{};
