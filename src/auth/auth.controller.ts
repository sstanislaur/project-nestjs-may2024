import {Controller, Post, Body, UseGuards, Req} from '@nestjs/common';
import {AuthService} from './auth.service';
import {LoginDto} from './dto/login.dto';
import {RegisterDto} from './dto/register.dto';
import {JwtAuthGuard} from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    logout(@Req() req) {
        console.log(`User ${req.user.email} logged out.`);
        return {message: 'Logout successful'};
    }

}
