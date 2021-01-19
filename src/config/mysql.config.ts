import {registerAs} from "@nestjs/config"
import { ConnectionOptions } from 'typeorm';
import { CustomOrmLogger } from 'src/shared/logger/ormLogger.service';
export default registerAs('DbConfig',():ConnectionOptions=>({
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
    logger: new CustomOrmLogger(),
    entities: [
        'dist/**/*.entity{.ts,.js}'
    ],
}))
