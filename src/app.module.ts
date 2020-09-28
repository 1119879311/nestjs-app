import { RoleGuard } from './common/guards/role.guard';
import { JwtAuthGuard } from './common/guards/authAll.guard';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CmsModule } from './modules/cms/cms.module';
import { RbacModule } from './modules/rbac/rbac.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import AppConfig from './config';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
      CmsModule, RbacModule,AuthModule,UserModule,
      ConfigModule.forRoot({
          load:AppConfig,
          isGlobal:true,
          ignoreEnvFile:false,
      }),
      TypeOrmModule.forRootAsync({
          inject:[ConfigService],
          useFactory:async  (config:ConfigService)=>config.get("DbConfig")
      })
    ],
  providers:[
      {
          provide:APP_GUARD,
          useClass:JwtAuthGuard
      },
      {
        provide:APP_GUARD,
        useClass:RoleGuard
    }
  ]
})
export class AppModule  implements NestModule {
    configure(consumer:MiddlewareConsumer){
        consumer.apply(LoggerMiddleware).forRoutes("*")
    }
}