import { IsNumber, IsOptional, IsString } from "class-validator";

export class TasksAuthorityDto{
    @IsNumber()
    id:number

    @IsString()
    authIds:string
}