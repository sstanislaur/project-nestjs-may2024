import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    private readonly logger = new Logger(JwtAuthGuard.name);

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            this.logger.warn('Missing or malformed token');
            throw new UnauthorizedException('Missing or malformed token');
        }

        const token = authHeader.split(' ')[1];

        try {
            const secret = this.configService.get<string>('JWT_SECRET');
            if (!secret) {
                this.logger.error('JWT_SECRET is not configured in the environment');
                throw new UnauthorizedException('Server misconfiguration: Missing JWT_SECRET');
            }

            const payload = this.jwtService.verify(token, { secret });

            request['user'] = payload;
            return true;
        } catch (error) {
            this.logger.error('JWT Verification Error', error.stack);
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
