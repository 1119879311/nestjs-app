import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ArticleService {
    constructor(private configService:ConfigService){}
    findAll(){
        console.log(this.configService.get("JwtConfig.secret"))
        return [
            {id:1}
        ]
    }
    findAllUser(){

    }
    createUser(){}
    modifyStatusUser(){}
    delUser(){ }
    findUserRole(){}
}