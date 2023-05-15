import {  IsNumber, IsNotEmpty, IsOptional, IsString, IsNumberString } from 'class-validator';
export  class FindImagesListDto{

    @IsNumberString()
    @IsOptional()
    id:number

    @IsString()
    @IsOptional()
    title:string

    @IsString()
    @IsOptional()
    cid:number

    @IsString()
    @IsOptional()
    classifyName


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

