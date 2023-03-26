import {  IsEmail, IsIn, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, Length, MinLength} from "class-validator"
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


    @IsPhoneNumber()
    @IsOptional()
    contact:string

    @IsNumber()
    @IsIn([1,2,3,4],{message:"用户类型参数有误,值为 1, 2,3,4 其一"})
    @IsOptional()
    user_type:number

    @IsNumber()
    @IsOptional()
    status:number

    @IsString()
    @IsOptional()
    roleIds:string

    @IsString()
    @IsOptional()
    tenantIds:string

}

