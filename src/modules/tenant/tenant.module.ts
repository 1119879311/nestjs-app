import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { tk_tenant } from '@/entity/tk_tenant.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([tk_tenant])
  ],
  controllers: [TenantController],
  providers: [TenantService]
})
export class TenantModule {}
