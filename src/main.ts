import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log("运行环境：",process.env.NODE_ENV)
  const app = await NestFactory.create(AppModule);
  let appConfig = app.get(ConfigService)
  let openStaticAssets = appConfig.get("openStaticAssets")
  console.log("openStaticAssets",openStaticAssets,`${process.cwd()}/config/${process.env.NODE_ENV||'development'}.env`)
  await app.listen(3000);
}
bootstrap();
