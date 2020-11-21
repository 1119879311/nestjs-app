import {  IsNumber, IsNotEmpty, IsOptional, IsString } from 'class-validator';
// @IsOptional() //如果不传，则跳过验证，如果属性传了就验证上面的规则
export  class SaveImagesDto{
    
    @IsOptional()
    id:number

    @IsNotEmpty({message:'urls不能为空'})
    @IsString()
    urls:string

    @IsString()
    @IsOptional()
    title:string

    @IsString()
    @IsOptional()
    remark:string

    @IsOptional()
    cid:string

    @IsNumber()
    @IsOptional()
    status:number

    @IsNumber()
    @IsOptional()
    sort:number
}

