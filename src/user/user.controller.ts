import {
    Controller, Post, Get, Body, UseGuards, Patch, Delete, Param, Req, Query, ForbiddenException
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { NotFoundException } from '@nestjs/common';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('register')
    async register(@Body() registerDto: RegisterUserDto) {
        return this.userService.register(registerDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll() {
        return this.userService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Post('find')
    async findUser(@Query('idOrEmail') idOrEmail: string) {
        const user = await this.userService.findOneByIdOrEmail(idOrEmail);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async updateUser(
        @Param('id') id: number,
        @Body() updateData: UpdateUserDto,
        @Req() req
    ) {
        if (req.user.id === Number(id)) {
            throw new ForbiddenException('You can only update your own account');
        }
        return this.userService.updateUser(Number(id), updateData);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteUser(@Param('id') id: number, @Req() req) {
        if (req.user.id === Number(id)) {
            throw new ForbiddenException('You can only delete your own account');
        }
        await this.userService.deleteUser(Number(id));
        return { message: 'User deleted successfully' };
    }

    @UseGuards(JwtAuthGuard)
    @Post('filter')
    async filterUsers(@Query() filters: FilterUserDto) {
        return this.userService.filterUsers(filters);
    }
}
