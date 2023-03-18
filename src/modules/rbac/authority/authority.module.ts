import { Module } from '@nestjs/common';
import { AuthorityService } from './authority.service';
import { AuthorityController } from './authority.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { tk_authority } from '@/entity/tk_authority.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([tk_authority])
  ],
  providers: [AuthorityService],
  controllers: [AuthorityController]
})
export class AuthorityModule {}
