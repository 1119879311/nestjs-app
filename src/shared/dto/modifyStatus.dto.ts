import {  IsNotEmpty, IsNumber, IsString} from "class-validator"
export  class modifyStatusDto{

    @IsNumber()
    id:number

    @IsNumber()
    status:number

}

export  class modifyStatusAllDto{

    @IsString()
    @IsNotEmpty()
    ids:string

    @IsNumber()
    status:number

}
