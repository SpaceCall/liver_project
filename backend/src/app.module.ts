import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DepartmentModule } from './department/department.module';
import { PositionModule } from './position/position.module';
import { PatientModule } from './patient/patient.module';
import { SeederService } from './seeder/seeder.service';
import { ThrottlerModule } from '@nestjs/throttler';


@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 20,
        },
      ], 
    }),
    ConfigModule,
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.getDatabaseConfig(),
        autoLoadModels: true,
        synchronize: true,
      }),
    }),
    UserModule,
    AuthModule,
    DepartmentModule,
    PositionModule,
    PatientModule,
    //add modules here
  ],
  providers: [SeederService],
})
export class AppModule {}