import { Body, Controller, Post, Req, Get, Res, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserService } from '../user/user.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) { }

    @Public()
    @Post('login')
    async login(@Body() dto: LoginDto, @Res() res: Response) {
        const result = await this.authService.login(dto.email, dto.password);

        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            //secure: true,
            path: '/auth/refresh',
        });

        res.cookie('csrfToken', result.csrfToken, {
            httpOnly: false,
            sameSite: 'strict',
            //secure: true,
        });

        return res.json({ accessToken: result.accessToken });
    }

    @Public()
    @Get('refresh')
    async refresh(@Req() req: Request, @Res() res: Response) {
        const refreshToken = req.cookies?.refreshToken;
        const result = await this.authService.refresh(refreshToken);

        res.cookie('csrfToken', result.csrfToken, {
            httpOnly: false,
            sameSite: 'strict',
            //secure: true,
        });

        res.json({ accessToken: result.accessToken });
    }

    @Get('me')
    async getMe(@CurrentUser() user: any) {
        if (!user?.userId) {
            throw new UnauthorizedException('Сеанс закінчився, будь ласка, увійдіть знову');
        }
        return this.userService.findOneWithRelations(user.userId);
    }

    @Post('logout')
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: 'strict',
            //secure: true,
            path: '/auth/refresh',
          });
        return { message: 'Успішний логаут' };
    }
}
