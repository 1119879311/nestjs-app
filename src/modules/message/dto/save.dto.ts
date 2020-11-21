import {  IsEmail, IsOptional } from "class-validator"

export class SavaMessageDto{

    // @IsNumber()
    // @IsOptional()
    // id:number

    @IsEmail()
    email:string

    @IsOptional()
    content:string

    @IsOptional()
    username:string

    @IsOptional()
    address:string

    @IsOptional()
    telephone:string

}