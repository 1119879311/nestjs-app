import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class SaveAuthorityDto{

    @IsNumber()
    @IsOptional()
    id:number

    @IsString()
    title:string

    @IsString()
    signName:string

    @IsNotEmpty()
    url:string

    @IsNumber()
    pid:number

    @IsNumber()
    @IsOptional()
    status:number

    @IsNumber()
    @IsOptional()
    sort:number

    @IsIn([1,2])
    auth_type:number
}