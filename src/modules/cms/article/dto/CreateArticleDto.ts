import {  IsNumber, IsNotEmpty, IsOptional, IsString } from 'class-validator';
// @IsOptional() //如果不传，则跳过验证，如果属性传了就验证上面的规则
export  class createArticleDto{
    @IsOptional()
    id:number


    @IsNotEmpty({message:'title不能为空'})
    title:string

    @IsNotEmpty({message:'content不能为空'})
    content:string

    @IsString()
    @IsOptional()
    remark:string

    @IsString()
    @IsOptional()
    tagIds:string

    @IsOptional()
    cid:number

    @IsString()
    @IsOptional()
    thumimg:string

    @IsNumber()
    @IsOptional()
    status:number

    @IsNumber()
    @IsOptional()
    sort:number
}

