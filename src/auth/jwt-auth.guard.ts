import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const authHeader = request.headers.authorization;

        console.log('Authorization Header:', authHeader);

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Missing or malformed token');
        }

        const token = authHeader.split(' ')[1];
        console.log('Extracted Token:', token);

        try {
            const secret = this.configService.get<string>('JWT_SECRET') || 'super_secret_key';
            const payload = this.jwtService.verify(token, { secret });

            console.log('Token Payload:', payload);
            request['user'] = payload;
            return true;
        } catch (error) {
            console.error('JWT Verification Error:', error);
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
