import { AppLogger } from '@/shared/logger/logger.service';
import { Logger, QueryRunner } from "typeorm";
export class CustomOrmLogger implements Logger {
    appLogger = new AppLogger()
    constructor(){
        this.appLogger.setContext("TyprOrmQuery")
    }
    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
        this.appLogger.log(query)
        // throw new Error("Method not implemented.");
    }
    logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner) {
       
        this.appLogger.error(`[query]:${query},[error]:${error}`)
        // throw new Error("Method not implemented.");
    }
    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
        // throw new Error("Method not implemented.");
        this.appLogger.log(`[query]:${query} [${time}]`)
    }
    logSchemaBuild(message: string, queryRunner?: QueryRunner) {
       
        this.appLogger.log(`${message} `)
    }
    logMigration(message: string, queryRunner?: QueryRunner) {
        this.appLogger.log(`${message} `)
    }
    log(level: "log" | "info" | "warn", message: any, queryRunner?: QueryRunner) {
       
         this.appLogger.log(`[${level},${message}]`)
        // this.appLogger[level](`${message} `)
    }
}