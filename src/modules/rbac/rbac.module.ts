
import { forwardRef, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ManagerModule } from './manager/manager.module';
import { RoleModule } from './role/role.module';
import { AuthorityModule } from './authority/authority.module';
import { AuthModule } from '../auth/auth.module';
@Module({
  imports: [ ManagerModule, RoleModule, AuthorityModule,forwardRef(()=>AuthModule),],
  controllers: [],
  providers: [],
})
export class RbacModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        // consumer
        // .apply()
        // .forRoutes();
    }
}
