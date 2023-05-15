import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class SaveAuthorityDto{

    @IsNumber()
    @IsOptional()
    id:number

    @IsString()
    @IsNotEmpty()
    name:string

    @IsString()
    @IsNotEmpty()
    code:string

    // @IsNotEmpty()
    @IsOptional()
    @IsString()
    url:string

    @IsNumber()
    @IsOptional()
    pid:number

    @IsNumber()
    @IsOptional()
    status:number

    @IsNumber()
    @IsOptional()
    sort:number

    @IsIn([1,2,3])
    auth_type:number
}