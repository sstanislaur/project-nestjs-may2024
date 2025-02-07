import { Controller, Post, Body, UseGuards, Req, HttpCode, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @HttpCode(200)
    async login(@Body() loginDto: LoginDto) {
        try {
            const result = await this.authService.login(loginDto);
            this.logger.log(`User ${loginDto.email} logged in successfully.`);
            return result;
        } catch (error) {
            this.logger.error(`Login failed for ${loginDto.email}: ${error.message}`);
            throw error;
        }
    }

    @Post('register')
    @HttpCode(201)
    async register(@Body() registerDto: RegisterDto) {
        try {
            const result = await this.authService.register(registerDto);
            this.logger.log(`User ${registerDto.email} registered successfully.`);
            return result;
        } catch (error) {
            this.logger.error(`Registration failed for ${registerDto.email}: ${error.message}`);
            throw error;
        }
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    logout(@Req() req) {
        const userEmail = req.user.email;
        this.logger.log(`User ${userEmail} logged out.`);
        return { message: 'Logout successful' };
    }
}
