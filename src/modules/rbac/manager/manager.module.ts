import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { ManagerController } from './manager.controller';

@Module({
  controllers: [ManagerController]
})
export class ManagerModule {
    constructor(
        private configService:ConfigService
    ){}
}
