import { SaveCommonDto } from "@/shared/dto/common.dto"
import {  IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Length, MinLength} from "class-validator"
export  class SaveRoleDto extends SaveCommonDto{

    @IsString()
    @IsOptional()
    desc:string
    
    @IsNumber()
    @IsIn([1,2],{message:"角色类型参数有误,值为 1, 2 其一"})
    @IsOptional()
    role_type:number


}

