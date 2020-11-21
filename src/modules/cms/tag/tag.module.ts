import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { tk_tag } from 'src/entity/tk_tag.entity';
import { TabController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
    imports:[
        TypeOrmModule.forFeature([tk_tag])
    ],
  controllers: [TabController],
  providers: [TagService]
})
export class TagModule {}
