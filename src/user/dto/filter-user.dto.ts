import { IsEmail, IsOptional, IsString } from 'class-validator';

export class FilterUserDto {
    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    name?: string;
}
