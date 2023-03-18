import {  IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Length, MinLength} from "class-validator"
export  class CreateUserDto{

    @IsNumber()
    @IsOptional()
    id:number

    @MinLength(2, { message: '用户名至少需要两位' })
    @IsNotEmpty({message:'用户名不能为空'})
    name:string

    @Length(4, 12,{message:'密码长度4-12位'})
    @IsOptional()
    password:string

    @IsEmail()
    @IsOptional()
    email: string;

    // @IsRegExp({pattern:/^1\d{10}/},{message:"号码格式不正确"})
    @IsOptional()
    contact:string

    @IsNumber()
    @IsOptional()
    user_type:number

    @IsNumber()
    @IsOptional()
    status:number

    @IsString()
    @IsOptional()
    roleIds:string

    pid:number
}

