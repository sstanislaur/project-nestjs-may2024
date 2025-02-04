import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ILike } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
      @InjectRepository(User)
      private usersRepository: Repository<User>,
  ) {}

  async register(email: string, password: string): Promise<User> {
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
    });

    return await this.usersRepository.save(user);
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


  async updateUser(id: number, updateData: Partial<User>): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    Object.assign(user, updateData);
    return await this.usersRepository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }

    await this.usersRepository.delete(id);
  }

  async findOneByIdOrEmail(idOrEmail: string): Promise<User | null> {
    if (!isNaN(Number(idOrEmail))) {
      return this.usersRepository.findOne({ where: { id: Number(idOrEmail) } });
    } else {
      return this.usersRepository.findOne({ where: { email: idOrEmail } });
    }
  }

  async filterUsers(filters: any): Promise<Partial<User>[]> {
    console.log('Received Filters:', filters);

    const where: any = {};
    if (filters.email) {
      where.email = ILike(`%${filters.email}%`);
    }
    if (filters.role) {
      where.role = filters.role;
    }

    console.log('Where Condition:', where);

    const users = await this.usersRepository.find({ where });

    return users.map(({ password, ...user }) => user);
  }

}

