import { LoggerService, Injectable, Scope } from '@nestjs/common'
import { createLogger, Logger, transports, format } from 'winston'
import "winston-daily-rotate-file"
const { combine, timestamp, printf } = format;
const myFormat = printf(({ level, message, context, timestamp}) => {
    return `[${process.env.NODE_ENV}][${timestamp}] context:[${context||'default'}] level:[${level}]  message: [${(message as any).stack||message}]`;
    
});

const winstonLevel = { error: 0, warn: 1, debug:2, info: 3, verbose: 4, silly: 5 };

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger implements LoggerService {
    private context?: string
    private winstonLogger: Logger
    public setContext(context: string) {
        this.context = context
    }
    constructor() {
        
        this.winstonLogger = createLogger({
            exitOnError:false,
            levels:winstonLevel,
            format: combine(
                timestamp({format:"YYYY-MM-DD HH:mm:ss"}),
                myFormat,
                
            ),
            transports: [
                new transports.Console({ level: 'info' }),
                // new transports.DailyRotateFile({
                //     filename: 'logs/application-error-%DATE%.log',
                //     datePattern: 'YYYY-MM-DD-HH',
                //     zippedArchive: true,
                //     maxSize: '20m',
                //     maxFiles: '14d',
                //     level:'error'
                // }),
                // new transports.DailyRotateFile({
                //     filename: 'logs/application-info-%DATE%.log',
                //     datePattern: 'YYYY-MM-DD-HH',
                //     zippedArchive: true,
                //     maxSize: '20m',
                //     maxFiles: '14d',
                //     level:'info'
                // }),
            ],
            
            
        })
       
    }

    log(message: any, context?: string) {
        return this.winstonLogger.info(message, { context: context || this.context })
    }

    error(message: any, trace?: string, context?: string): any {
        return this.winstonLogger.error(message, { trace, context: context || this.context })
    }

    warn(message: any, context?: string): any {
        return this.winstonLogger.warn(message, { context: context || this.context })
    }

    debug(message: any, context?: string): any {
        return this.winstonLogger.debug(message, { context: context || this.context })
    }

    verbose(message: any, context?: string): any {
        return this.winstonLogger.verbose(message, { context: context || this.context })
    }
}