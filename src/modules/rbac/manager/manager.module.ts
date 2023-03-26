import { tk_tenant } from './../../../entity/tk_tenant.entity';
import { tk_role } from './../../../entity/tk_role.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { tk_user } from '@/entity/tk_user.entity';
import { ManagerController } from './manager.controller';
import { MannagerService } from './manager.service';

@Module({
    imports:[
        TypeOrmModule.forFeature([tk_user,tk_role,tk_tenant])
    ],
  controllers: [ManagerController],
  providers:[MannagerService]
})
export class ManagerModule {}
