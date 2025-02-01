import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository {
    constructor(@InjectRepository(User) private repo: Repository<User>) {}

    async createUser(email: string, password: string) {
        const user = this.repo.create({ email, password });
        return await this.repo.save(user);
    }

    async findByEmail(email: string) {
        return await this.repo.findOneBy({ email });
    }
}
