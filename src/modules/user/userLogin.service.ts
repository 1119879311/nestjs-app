import { ConfigService } from '@nestjs/config';
import { AuthService } from './../auth/auth.service';
import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import * as svgCaptcha from "svg-captcha"
import { Aes, TimeTranform } from 'src/shared/util';
import { userLoginDto } from './dto/userLogin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { tk_user } from 'src/entity/tk_user.entity';

@Injectable()
export class UserLoginService{
    constructor(
        private configService:ConfigService,
        private authService:AuthService,
        @InjectRepository(tk_user) private readonly tkUserRepository: Repository<tk_user>
    ){}

    async login(data:userLoginDto){
        // 先验证验证码
        
        if(!this.verifyCode(data.codetoken,data.code)){
            throw new BadRequestException('图形认证码失败')
        }
        //验证密码
        // let userInfo =  await this.tkUserRepository.findOne({where:{name:data.username} })
        let userInfo = await this.tkUserRepository.createQueryBuilder('u').where('u.name=:username',{username:data.username}).addSelect('u.password').getOne();
        // 账号不存在
        if(!userInfo) throw new HttpException('账号不存在', HttpStatus.BAD_REQUEST)

        // 密码错误
        
        let aesPassword = Aes.decrypt(userInfo.password,this.configService.get('password_secret'))
      
        if(!aesPassword||aesPassword!=data.password){
            throw new HttpException('密码错误', HttpStatus.BAD_REQUEST)
        }
        

        // 不是超级用户，状态不为1的为禁用状态
        if(userInfo.user_type!=1&&userInfo.status!=1)  {
            throw new HttpException('该账号已被禁用，请切换账号登录', HttpStatus.FORBIDDEN)
        }
        //生成token
        let resData = {...userInfo,password:''}
        let token = await this.authService.loginSign(resData);
        return {...resData,token}
    }
    /**
     * 生成验证码
     */
    async code(){
        let codeConfig = {
            size: 4, // 验证码长度
            width:120,
            height:32,
            fontSize: 50,
            ignoreChars: '0oO1ilI', // 验证码字符中排除 0o1i
            noise: 2, // 干扰线条的数量
            color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
            background: '#fff' // 验证码图片背景颜色
        }
        var captcha = svgCaptcha.create(codeConfig);
        let codeText = captcha.text.toLocaleLowerCase();
        let expiresIn = TimeTranform(this.configService.get("code_expiresIn"))
        let data = {codeText:codeText,time:new Date().getTime(),expiresIn:expiresIn};
        let codeToken = Aes.encryption(JSON.stringify(data),codeText.toLowerCase())
        return {codeSvg:captcha.data,codeToken:codeToken}
       
    }
    /**验证码校验，不区分大小写
     * 
     * @param encryData 加密后的数据 
     * @param dataKey   加密的datakey 密钥
     */
    verifyCode(encryData:string,dataKey:string):boolean{
        let verifyStr = Aes.decrypt(encryData,dataKey.toLowerCase());
        if(!verifyStr) return false;
        let verifyRes = JSON.parse(verifyStr);
        if(new Date().getTime()>=verifyRes.time+verifyRes.expiresIn){
            return false
        }
        return true
    }


    jiajiemi(data = {value:'',time:'',type:''}){
        let {value='',time='',type=''} = data
        if(!value||!this.veryfyTime(time)||!type){
            throw new NotFoundException("NoFound")
        }
        if(type==='jiemi'){
            return  Aes.decrypt(value,"password_secret")
        }else if(type==='jiami'){
            return Aes.encryption(value,this.configService.get('password_secret'))
        }
        throw new NotFoundException("签名fail") 
       
    }
   
    veryfyTime(time:string){
        let nowData= new Date()
        let nowTime = nowData.getFullYear()+'-'+(nowData.getMonth()+1)+'-'+nowData.getDate()
        return nowTime===time;
    }
}
