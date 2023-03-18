import {  IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class SavaTagDto{

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