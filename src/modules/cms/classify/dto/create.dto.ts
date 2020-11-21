import {  IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

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