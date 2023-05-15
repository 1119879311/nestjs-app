import { SaveCommonDto } from "@/shared/dto/common.dto";
import {  IsIn, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

export  class FindRoleListDto{

    @IsNumberString()
    @IsOptional()
    id:number

    @IsString()
    @IsOptional()
    name:string

    @IsNumberString()
    @IsOptional()
    status:number

    @IsString()
    @IsOptional()
    startTime:string

    @IsString()
    @IsOptional()
    endTime:string

    @IsNumberString()
    @IsOptional()
    page:number

    @IsNumberString()
    @IsOptional()
    offset:number
}

export  class SaveRoleDto extends SaveCommonDto{

    @IsString()
    @IsOptional()
    desc:string
    
    @IsNumber()
    @IsIn([1,2],{message:"角色类型参数有误,值为 1, 2 其一"})
    @IsOptional()
    role_type:number


}
export class TasksAuthorityDto{
    @IsNumber()
    id:number

    @IsString()
    authIds:string
}