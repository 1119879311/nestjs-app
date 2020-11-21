import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { tk_classify } from 'src/entity/tk_classify.entity';
import { ClassifyController } from './classify.controller';
import { ClassifyService } from './classify.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([tk_classify])
  ],
  controllers: [ClassifyController],
  providers: [ClassifyService],
  exports:[ClassifyService]
})
export class ClassifyModule {}
