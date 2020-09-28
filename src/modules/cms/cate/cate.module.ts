import { CateController } from './cate.controller';
import { Module } from '@nestjs/common';
import { CateService } from './cate.service';

@Module({
  controllers:[CateController],
  providers: [CateService]
})
export class CateModule {}
