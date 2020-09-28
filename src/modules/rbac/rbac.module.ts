
import { Module } from '@nestjs/common';
import { ManagerModule } from './manager/manager.module';
import { RoleModule } from './role/role.module';
@Module({
  imports: [ ManagerModule, RoleModule],
  controllers: [],
  providers: [],
})
export class RbacModule {}
