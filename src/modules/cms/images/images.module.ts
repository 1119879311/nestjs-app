import { tk_classify } from '@/entity/tk_classify.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { tk_images } from '@/entity/tk_images.entity';
import { ClassifyModule } from '../classify/classify.module';

@Module({
    imports:[
        forwardRef(()=>ClassifyModule),
        TypeOrmModule.forFeature([tk_images,tk_classify])
    ],
  controllers: [ImagesController],
  providers: [ImagesService]
})
export class ImagesModule {}
