import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleController } from './article.controller';
import { tk_classify } from '@/entity/tk_classify.entity';
import { tk_tag } from '@/entity/tk_tag.entity';
import { tk_article } from '@/entity/tk_article.entity';
import { ArticleService } from './article.service';
import { ClassifyModule } from './../classify/classify.module';
@Module({
    imports:[
        forwardRef(()=>ClassifyModule), //forwaredRef() 解决循环依赖问题
        TypeOrmModule.forFeature([tk_article,tk_classify,tk_tag])
    ],
    controllers: [ArticleController],
    providers: [ArticleService],
  })
export class ArticleModule {}
