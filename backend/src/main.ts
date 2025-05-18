import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { NestFactory, Reflector  } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { CsrfGuard } from './auth/guards/csrf.guard';
import { GlobalExceptionFilter } from './filter/global-exception.filter';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const reflector = app.get(Reflector);

  app.enableCors({
    origin: ['http://localhost:3080'],
    credentials: true,          
  });
  
  app.useStaticAssets(path.join('/app/imagesdb'), {
    prefix: '/images',
  });
  app.useGlobalGuards(
    new JwtAuthGuard(reflector),
    new CsrfGuard(reflector),
  );

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,              
      forbidNonWhitelisted: true,    
      transform: true,           
    }),
  );
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(3090);
}
bootstrap();
