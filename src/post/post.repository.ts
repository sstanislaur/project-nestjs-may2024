import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';

@Injectable()
export class PostRepository {
    constructor(@InjectRepository(Post) private repo: Repository<Post>) {}

    async createPost(text: string, userId: number) {
        const post = this.repo.create({ text, user: { id: userId } });
        return await this.repo.save(post);
    }

    async findAll() {
        return await this.repo.find();
    }
}
