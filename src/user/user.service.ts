import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';

@Injectable()
export class UserService {
  constructor(
      @InjectRepository(User)
      private usersRepository: Repository<User>,
  ) {}

  async register(dto: RegisterUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({ where: { email: dto.email } });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepository.create({ ...dto, password: hashedPassword });
    return this.usersRepository.save(user);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async updateUser(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    Object.assign(user, dto);
    return this.usersRepository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersRepository.delete(id);
  }

  async findOneByIdOrEmail(idOrEmail: string): Promise<User | null> {
    const condition = !isNaN(Number(idOrEmail)) ? { id: Number(idOrEmail) } : { email: idOrEmail };
    return this.usersRepository.findOne({ where: condition });
  }

  async filterUsers(filters: FilterUserDto): Promise<Omit<User, 'password'>[]> {
    console.log('Filtering with:', filters);
    const where: any = {};

    if (filters.email) {
      where.email = ILike(`%${filters.email}%`);
    }

    const users = await this.usersRepository.find({ where });
    console.log('Filtered users:', users);

    return users.map(({ password, ...user }) => user);
  }

}
