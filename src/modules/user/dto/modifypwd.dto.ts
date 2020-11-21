
import {  IsNotEmpty, IsNumberString, IsOptional} from "class-validator"
import { IsEqualsThan } from "src/common/decorators/validator.decorators"

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