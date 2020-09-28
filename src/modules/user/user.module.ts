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
        TypeOrmModule.forFeature([tk_user])
    ],
    controllers:[UserLoginController,UserCenterController],
    providers:[UserLoginService,UserCenterService]
})
export class UserModule{};
