import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import AppConfig from '@/config';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [

    ConfigModule.forRoot({ //配置模块
      load: AppConfig,
      isGlobal: true,
      ignoreEnvFile: false,
      envFilePath: `${process.cwd()}/config/${process.env.NODE_ENV || 'development'}.env`,
      
  }),

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
