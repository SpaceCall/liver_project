import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as crypto from 'crypto';
import { plainToInstance } from 'class-transformer';
import { AuthResponseDto } from './dtos/auth-response.dto';


@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    private generateCsrfToken(): string {
        return crypto.randomBytes(24).toString('hex');
    }

    async login(email: string, password: string) {
        const user = await this.userService.findByEmail(email);
        const hash = this.userService['hashPassword'](password, user.Salt);
        if (hash !== user.Hash) {
            throw new UnauthorizedException('Неправильний логін або пароль');
        }

        const payload = {
            sub: user.Id,
            email: user.Email,
            isAdmin: user.IsAdmin,
        };

        const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

        const csrfToken = this.generateCsrfToken();
        return plainToInstance(AuthResponseDto, {
            accessToken,
            refreshToken,
            csrfToken,
        });
    }

    async refresh(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const user = await this.userService.findOne(payload.sub);

            const newPayload = {
                sub: user.Id,
                email: user.Email,
                isAdmin: user.IsAdmin,
            };

            const newAccessToken = this.jwtService.sign(newPayload, { expiresIn: '15m' });
            const newRefreshToken = this.jwtService.sign(newPayload, { expiresIn: '7d' });

            const csrfToken = this.generateCsrfToken();

            return plainToInstance(AuthResponseDto, {
                accessToken: newAccessToken,       
                refreshToken: newRefreshToken,
                csrfToken,
            });
        } catch (err) {
            throw new UnauthorizedException('Сесія, недійсна або закінчилася. Будь ласка, перезавантажте сторінку.');
        }
    }
}
