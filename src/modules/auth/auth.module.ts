import { UserModule } from '../user/user.module';
import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { jwtConstants } from "./constants";
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';

@Module({
    imports:[
        forwardRef(()=>UserModule), //forwaredRef() 解决循环依赖问题
        PassportModule.register({ defaultStrategy: 'jwt' }),


        //由于所有config参数配置是通过.env文件 设置在process.env 里面，再统一获取注册configModule到全局模块中，
        //然后通过ConfigService 获取
        //问题：  这里的JwtModule.register() 怎么用ConfigService 这服务 获取 已经注册到configModule 的参数啊
        // JwtModule.register({ //注册jwt   // 这里使用同步
        //     secret:jwtConstants.secret,
        //     signOptions:{ expiresIn:'24h' }
        // }) 
         JwtModule.registerAsync({ // 使用异步
             inject:[ConfigService],
             useFactory:async (config:ConfigService)=>({
                secret:config.get('JwtConfig.secret'),
                signOptions:{
                    expiresIn:config.get('JwtConfig.expiresIn')
                }

             })
         })
    ],
    providers:[AuthService,JwtStrategy],
    exports:[AuthService]
})
export class AuthModule{}