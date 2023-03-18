import {  IsNumberString, IsOptional, IsString } from "class-validator";

export  class FindUserDto{
    @IsString()
    @IsOptional()
    name:string
    
    @IsString()
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