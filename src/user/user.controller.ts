import {Controller, Post, Get, Body, UseGuards, Patch, Delete, Param, Req} from '@nestjs/common';
import {UserService} from './user.service';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {User} from './entities/user.entity';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Post('register')
    async register(@Body() body: { email: string; password: string }) {
        return this.userService.register(body.email, body.password);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll() {
        return this.userService.findAll();
    }

    @Get(':idOrEmail')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('idOrEmail') idOrEmail: string) {
        return this.userService.findOneByIdOrEmail(idOrEmail);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async updateUser(
        @Param('id') id: number,
        @Body() updateData: Partial<User>,
        @Req() req
    ) {
        if (req.user.id === Number(id)) {
            throw new Error('You can only update your own account');
        }
        return this.userService.updateUser(Number(id), updateData);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteUser(@Param('id') id: number, @Req() req) {
        if (req.user.id === Number(id)) {
            throw new Error('You can only delete your own account');
        }
        await this.userService.deleteUser(Number(id));
        return {message: 'User deleted successfully'};
    }
}
