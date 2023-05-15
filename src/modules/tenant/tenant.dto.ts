import { SaveCommonDto } from "@/shared/dto/common.dto"
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateTenantDto extends SaveCommonDto{


    @IsIn([1,2,3],{message:"租户类型参数有误,值为 1, 2, 3其一"})
    data_access:number


}

export class UpdateTenantDto {}