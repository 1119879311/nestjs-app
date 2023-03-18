import { AuthService } from './auth.service';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
// import { jwtConstants } from './constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy  extends PassportStrategy(Strategy){
    constructor(
        private authService:AuthService,
        private readonly configService:ConfigService
    ){
       
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),//ExtractJwt.fromHeader('token')
            ignoreExpiration: false,
            secretOrKey: configService.get('JwtConfig.secret'),
        })
    }
    /**
     * 重写 validate 方法，验证通过后 payload 的内容题为之前签名的是数据，会在request 请求体加上user 的属性
     * @param payload 
     */
    async validate<T>(payload:T):Promise<T>{
        let res = await this.authService.validateUser(payload)
        if(!res) new UnauthorizedException();
        return res;
    }
}