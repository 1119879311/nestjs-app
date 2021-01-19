import {  IsEmpty,IsNotEmpty, IsNumber,IsString} from "class-validator"
export  class veryfyIdDto{

    @IsNumber()
    @IsNotEmpty()
    id:number
}

export  class veryfyIdsDto{

    @IsString()
    @IsNotEmpty()
    ids:string
}
