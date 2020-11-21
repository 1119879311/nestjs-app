import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
// import { Aes } from './common/util';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
const port = process.env.PORT||3000;

// let res = Aes.encryption('123456',"password_secret")
// console.log('加密',res)
// // let resD = Aes.decrypt(res,"password_secret")
// // console.log('解密',resD)
// // console.log(TimeTranform("5m"),1000*60*5)
console.log("当前运行环境:",process.env.NODE_ENV)
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule,{
      cors:true
  });
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
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new ResponseInterceptor())
  app.useStaticAssets(join(__dirname, '..', 'theme'),{prefix:"/theme/"});
  await app.listen(port);
}
bootstrap();
