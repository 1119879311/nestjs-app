import { tk_authority } from './../../entity/tk_authority.entity';
import { tk_role } from './../../entity/tk_role.entity';
import { UserLoginService } from './userLogin.service';
import { UserCenterController } from './userCenter.controller';
import { UserLoginController } from './userLogin.controller';
import { forwardRef, Module } from "@nestjs/common";
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { tk_user } from './../../entity/tk_user.entity';
import { UserCenterService } from './userCenter.service';

@Module({
    imports:[
        forwardRef(()=>AuthModule),
        TypeOrmModule.forFeature([tk_user,tk_role,tk_authority])
    ],
    controllers:[UserLoginController,UserCenterController],
    providers:[UserLoginService,UserCenterService],
    exports:[UserCenterService]
})
export class UserModule{};
