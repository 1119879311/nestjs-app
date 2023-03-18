import { Response } from 'express';
import { UserLoginService } from './userLogin.service';
import { Body, Controller, Get, HttpStatus, Param, Post, Query, Res } from "@nestjs/common";
import { NoAuth } from 'src/shared/decorators/noAuth.decorators';
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
        return res;
          
        
    }

    /**
     * 获取图片验证码
     */
    @Get("code")
    @NoAuth("ALL")
    async code(@Res() res:Response){
        let {codeSvg,codeToken} = await this.userLoginService.code()
        res.append("codeToken",codeToken)
        res.type('html')
        res.status(HttpStatus.OK).send(codeSvg);
    }

    @Get("sign/:type/:time/:value")
    @NoAuth("ALL")
    async jiajiemi(@Param() data){
        return await this.userLoginService.jiajiemi(data)
    }

}