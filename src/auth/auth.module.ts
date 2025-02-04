import {Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {UserModule} from '../user/user.module';
import {JwtAuthGuard} from './jwt-auth.guard';

@Module({
    imports: [
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET') || 'super_secret_key',
                signOptions: {expiresIn: '1d'},
            }),
        }),
        UserModule,
    ],

    providers: [AuthService, JwtAuthGuard],
    controllers: [AuthController],
    exports: [JwtModule],
})
export class AuthModule {
}
