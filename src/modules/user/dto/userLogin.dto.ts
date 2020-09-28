import { IsNotEmpty} from "class-validator"

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