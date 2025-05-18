import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { CsrfGuard } from './guards/csrf.guard';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [
        PassportModule,
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get('JWT_SECRET'),
                signOptions: { expiresIn: '15m' },
            }),
        }),
        UserModule,
    ],
    providers: [AuthService, JwtAuthGuard, CsrfGuard, JwtStrategy],
    exports: [JwtAuthGuard, CsrfGuard, JwtStrategy], 
    controllers: [AuthController],
})
export class AuthModule { }