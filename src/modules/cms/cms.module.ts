import { Module } from '@nestjs/common';
import { ArticleModule } from './article/article.module';
import { TagModule } from './tag/tag.module';
import { ClassifyModule } from './classify/classify.module';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [ArticleModule, TagModule, ClassifyModule, ImagesModule],
  controllers: [],
  providers: [],
})
export class CmsModule {}
