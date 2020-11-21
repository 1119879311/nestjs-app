
import { Module } from '@nestjs/common';
import { ManagerModule } from './manager/manager.module';
import { RoleModule } from './role/role.module';
import { AuthorityModule } from './authority/authority.module';
@Module({
  imports: [ ManagerModule, RoleModule, AuthorityModule],
  controllers: [],
  providers: [],
})
export class RbacModule {}
