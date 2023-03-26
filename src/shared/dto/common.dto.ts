import {  IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Length, MinLength} from "class-validator"

export  class SaveCommonDto{

    @IsNumber()
    @IsOptional()
    id:number

    @IsString()
    @IsNotEmpty()
    name:string


    @IsNumber()
    @IsOptional()
    status:number

    @IsNumber()
    @IsOptional()
    sort:number

}

