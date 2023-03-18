import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { tk_message } from '@/entity/tk_message.entity';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
  imports:[
      TypeOrmModule.forFeature([tk_message])
  ],
  controllers: [MessageController],
  providers: [MessageService]
})
export class MessageModule {}
