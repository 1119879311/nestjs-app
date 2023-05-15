import {  IsNumber, IsNotEmpty, IsOptional, IsString, IsNumberString } from 'class-validator';
// @IsOptional() //如果不传，则跳过验证，如果属性传了就验证上面的规则


export  class FindArtilceListDto{

    @IsNumberString()
    @IsOptional()
    id:number

    @IsString()
    @IsOptional()
    title:string

    @IsString()
    @IsOptional()
    tabId:number

    @IsString()
    @IsOptional()
    cid:number

    @IsString()
    @IsOptional()
    classifyName

    // @IsNumberString({no_symbols:true})
    @IsOptional()
    status:number

    @IsString()
    @IsOptional()
    
    startTime:string

    @IsString()
    @IsOptional()
    endTime:string

    @IsNumberString({no_symbols:true})
    @IsOptional()
    page:number

    @IsNumberString({no_symbols:true})
    @IsOptional()
    offset:number
}

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

