import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { tk_role } from '@/entity/tk_role.entity';
import { tk_user } from '@/entity/tk_user.entity';
import { tk_authority } from '@/entity/tk_authority.entity';

@Module({
    imports:[
        TypeOrmModule.forFeature([tk_user,tk_role,tk_authority])
    ],
    providers: [RoleService],
    controllers: [RoleController]
})
export class RoleModule {}
