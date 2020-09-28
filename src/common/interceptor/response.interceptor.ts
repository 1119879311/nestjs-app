
// 全局响应拦截器
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Response } from "express";
import { Observable } from "rxjs";
import {map} from "rxjs/operators"
// 声明
interface ResBody<T>{
    data:T
}

// 注意：响应映射功能不适用于特定于库的响应策略（禁止直接使用@Res()对象）。

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T,ResBody<T>>{
    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ResBody<T>> | Promise<Observable<ResBody<T>>> {
        const ctx = context.switchToHttp();
        const res = ctx.getResponse();
        console.log("before:","全局响应拦截器之前")
        return next.handle().pipe(map((data:T)=>{
            console.log("after:",'全局响应拦截器之后')
            return {
                statusCode: 200, 
                data: data, 
                status:true,
                message:'操作成功'
            }
        }))
        
        
    }
}