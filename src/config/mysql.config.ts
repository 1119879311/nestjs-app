import {join,resolve} from 'path';
import * as fs from "fs"
import {registerAs} from "@nestjs/config"
import { DataSourceOptions } from 'typeorm';
import { CustomOrmLogger } from '@/shared/logger/ormLogger.service';
function loadEntity(dirPath="",result = []){
    try {
        if( !fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) return result
        // 读取文件
        let allFileOrDir = fs.readdirSync(dirPath)
        allFileOrDir.forEach(item=>{
            let filePath = resolve(dirPath, item);
            if(fs.statSync(filePath).isFile() && ( item.endsWith(".entity.js") || item.endsWith(".entity.ts") )){
                const importResult = require(filePath)
                const resultList = Object.values(importResult)
                result = result.concat(resultList)
            }else if(fs.statSync(filePath).isDirectory()){
                result = result.concat(loadEntity(filePath))  
            }

        })
        return result
    } catch (error) {
        return result
    }
}

export default registerAs('DbConfig',():DataSourceOptions=>({
    type:"mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    charset: process.env.DB_CHARSER,
    cache:true,
    multipleStatements: true,
    dropSchema: false,
    synchronize: true,
    maxQueryExecutionTime: 1000,
    logging:['error'] ,
    // logger: new CustomOrmLogger(),
    entities:loadEntity(join(__dirname,'..','entity'))
    // entities: [
    //     // entitiesPath
    //      tk_tag,tk_article
    // //    'dist/**/*.entity{.ts,.js}'
    // ],
}))
