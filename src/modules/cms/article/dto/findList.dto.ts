import {  IsNumberString, IsOptional, IsString } from "class-validator";

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