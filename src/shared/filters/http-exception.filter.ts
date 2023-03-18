import { AppLogger } from 'src/shared/logger/logger.service';
import { ArgumentsHost, Catch, ExceptionFilter,HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response } from 'express';
// 全局异常过滤器处理
@Catch()
export class HttpExceptionFilter implements ExceptionFilter{
    constructor( private readonly appLogger:AppLogger){}
    catch(exception: HttpException, host: ArgumentsHost) {
        this.appLogger.warn("进入全局异常过滤器",'ExceptionResponse')
        const ctx = host.switchToHttp();
        const req = ctx.getRequest<Request>();
        const res = ctx.getResponse<Response>()
        // 异常状态码：
        let status = exception instanceof HttpException?exception.getStatus():HttpStatus.INTERNAL_SERVER_ERROR
        
        //错误信息：
        let errResBody =typeof exception.getResponse==='function'?exception.getResponse():exception;// string|object ts无法知道object的成员
        const message = typeof errResBody==='object'?{message:(errResBody as any).message}:{message:errResBody}
            ||{message:exception.message} || {message:'服务器异常'};
            
        let resBody = {
            ...message,
            statusCode: status, // 系统错误状态 
            data: null, // 错误消息内容体(争取和拦截器中定义的响应体一样)
            status:false
        }
        // let logBody = {
        //     ...resBody,
        //     timestamp: new Date().toISOString(), // 错误日期
        //     reqPath: req.url, // 错误路由
        // }
        if(status===404){
            this.appLogger.warn(` ${message.message} ${req.ip}`,"ExceptionResponse")
        }else{
            this.appLogger.error(`${req.url},${req.method},${req.ip},${exception.stack}`,exception.stack,'ExceptionResponse')
        }
        // Logger.error("错误信息",JSON.stringify(logBody),'HttpExceptionFilter')
        res.status(200).json(resBody)
    }
    
}