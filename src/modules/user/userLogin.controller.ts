import { Response } from 'express';
import { UserLoginService } from './userLogin.service';
import { Body, Controller, Get, HttpStatus, Post, Res } from "@nestjs/common";
import { NoAuth } from 'src/common/decorators/noAuth.decorators';
import { userLoginDto } from './dto/userLogin.dto';



@Controller()
export class UserLoginController{
    constructor(
        private userLoginService:UserLoginService,
    ){}
    /**
     * 登录
     */
    
    @Post("login")
    @NoAuth("ALL")
    async login(@Body() userData:userLoginDto){
        let res = await this.userLoginService.login(userData)
        console.log(res)
        return res;
          
        
    }

    /**
     * 获取图片验证码
     */
    @Get("code")
    @NoAuth("ALL")
    async code(@Res() res:Response){
        let {codeSvg,codeToke} = await this.userLoginService.code()
        res.append("codeToke",codeToke)
        res.type('html')
        res.status(HttpStatus.OK).send(codeSvg);
    }

}