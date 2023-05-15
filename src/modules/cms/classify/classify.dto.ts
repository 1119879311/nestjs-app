import {  IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator"

export  class FindClassifyListDto{

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
    
    @IsOptional()
    isPage:string|boolean
}

export class SavaClassifyDto{

    @IsNumber()
    @IsOptional()
    id:number

    @IsString()
    @IsNotEmpty()
    name:string

    @IsNumber()
    @IsOptional()
    pid:number

    @IsNumber()
    @IsOptional()
    status:number

    @IsNumber()
    @IsOptional()
    sort:number

}