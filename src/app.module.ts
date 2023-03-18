import { RoleGuard } from './shared/guards/role.guard';
import { JwtAuthGuard } from './shared/guards/auth.guard';
import {   MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CmsModule } from './modules/cms/cms.module';
import { RbacModule } from './modules/rbac/rbac.module';
import { LoggerMiddleware } from './shared/middleware/logger.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import AppConfig from './config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadModule } from './modules/upload/upload.module';
import { MessageModule } from './modules/message/message.module';
import { LoggerModule } from './shared/logger/logger.module';
@Module({
    imports: [
        CmsModule, RbacModule, AuthModule, UserModule, UploadModule,MessageModule, //业务模块
        LoggerModule,//日志模块
        // CacheModule.register(), //缓存模块
        ConfigModule.forRoot({ //配置模块
            load: AppConfig,
            isGlobal: true,
            ignoreEnvFile: false,
            envFilePath: `${process.cwd()}/config/${process.env.NODE_ENV || 'development'}.env`,
        }),
        TypeOrmModule.forRootAsync({//数据库模块
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => config.get("DbConfig")
        }),
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard
        },
        {
            provide: APP_GUARD,
            useClass: RoleGuard
        },
        // {
        //     provide: APP_INTERCEPTOR,
        //     useClass: CacheInterceptor,
        // },
    ]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes("*")
    }
}
