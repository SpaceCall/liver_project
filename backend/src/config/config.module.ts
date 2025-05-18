import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ConfigService } from './config.service';
import databaseConfig from './database.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true, 
      load: [databaseConfig],
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
