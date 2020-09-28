import { Module } from '@nestjs/common';
import { ArticleModule } from './article/article.module';
import { CateModule } from './cate/cate.module';
@Module({
  imports: [ArticleModule, CateModule],
  controllers: [],
  providers: [],
})
export class CmsModule {}
