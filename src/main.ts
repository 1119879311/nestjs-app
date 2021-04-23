import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { ResponseInterceptor } from './shared/interceptor/response.interceptor';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppLogger } from './shared/logger/logger.service';
const port = process.env.PORT||3000;

console.log("当前运行环境:",process.env.NODE_ENV)
async function bootstrap() {
  const logger = new AppLogger()
  const app = await NestFactory.create<NestExpressApplication>(AppModule,{
      cors:true,
      logger:logger
  });
    //app.useLogger(new AppLogger())
    //app.useLogger(app.get(AppLogger))
   // 设置所有 api 访问前缀
  app.setGlobalPrefix('/api')
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true, //如果设置为 true，则验证程序将除去未使用任何装饰器的属性的已验证对象
    forbidNonWhitelisted: false, //则验证程序将引发异常，而不是取消非白名单属性。
    skipMissingProperties: false, //如果设置为 true，则验证程序将跳过验证对象中缺少的属性的验证
    exceptionFactory:function(err:ValidationError[]){//设置异常的工厂方法，用来定义并返回要抛出的异常信息
        if(err[0]){
            let errRes = Object.values(err[0].constraints)
            throw new BadRequestException(errRes[0])
        }
        throw new BadRequestException()
    }
  }))
  app.useGlobalFilters(new HttpExceptionFilter(logger))
  app.useGlobalInterceptors(new ResponseInterceptor(logger))
//   app.use(LoggerMiddleware)
//   let logger = app.get(AppLogger)
  let appConfig = app.get(ConfigService)
  let openStaticAssets = appConfig.get("openStaticAssets")
  if(openStaticAssets==="1"){
    logger.log("开启静态资源托管")
    app.useStaticAssets(join(__dirname, '..', 'theme'),{prefix:"/theme/"});
    app.useStaticAssets(join(__dirname, '..', 'build'));
  }else{
    logger.log("关闭静态资源托管")
  }
  await app.listen(port,'0.0.0.0',()=>{
      logger.log(`server is successful started in port:${port},http://127.0.0.1:${port}`,"AppServer")
  });
}
bootstrap();
