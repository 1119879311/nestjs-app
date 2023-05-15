import {  IsNotEmpty, IsNumberString, IsOptional} from "class-validator"
import { IsEqualsThan } from "@/shared/decorators/validator.decorators"

export class modifypwdDto{
    @IsNumberString()
    @IsOptional()
    id:number

    @IsNotEmpty({message:'密码不能为空'})
    password:string

    @IsEqualsThan("password",{message:'两次密码不一致'})
    @IsNotEmpty({message:'确认密码不能为空'})
    checkPass:string

}

export class userLoginDto{

    @IsNotEmpty({message:'用户名不能为空'})
    username:string

    @IsNotEmpty({message:'密码不能为空'})
    password:string

    @IsNotEmpty({message:'验证码不能为空'})
    code:string

    @IsNotEmpty({message:'无效的验证码'})
    codetoken:string
}