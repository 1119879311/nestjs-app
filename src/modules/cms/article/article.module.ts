import { ClassifyModule } from './../classify/classify.module';
import { tk_article } from 'src/entity/tk_article.entity';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { tk_classify } from 'src/entity/tk_classify.entity';
import { tk_tag } from 'src/entity/tk_tag.entity';

@Module({
    imports:[
        forwardRef(()=>ClassifyModule), //forwaredRef() 解决循环依赖问题
        TypeOrmModule.forFeature([tk_article,tk_classify,tk_tag])
    ],
    controllers: [ArticleController],
    providers: [ArticleService],
  })
export class ArticleModule {}
