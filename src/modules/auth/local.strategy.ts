import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

// @Injectable()
// export class LocalStrategy extends PassportStrategy(Strategy) {
//     constructor(private authService: AuthService) {
//         super();
//     }

//     async validate<T>(payload:T){
//         let res = await this.authService.validateUser(payload)
//         if(!res) new UnauthorizedException();
//         return res;
//     }
// }