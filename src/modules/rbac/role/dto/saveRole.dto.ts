import {  IsNotEmpty, IsNumber, IsOptional, IsString, Length, MinLength} from "class-validator"

export  class SaveRoleDto{

    @IsNumber()
    @IsOptional()
    id:number

    @IsString()
    @IsNotEmpty()
    name:string

    @IsString()
    @IsNotEmpty()
    desc:string
    

    @IsNumber()
    @IsOptional()
    role_type:number

    @IsNumber()
    @IsOptional()
    status:number

    @IsNumber()
    @IsOptional()
    sort:number
    
    pid:number
}

