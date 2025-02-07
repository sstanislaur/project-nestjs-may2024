import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class PostRepository {
    constructor(
        @InjectRepository(Post) private postRepo: Repository<Post>,
        @InjectRepository(User) private userRepo: Repository<User>,
    ) {}

    async createPost(text: string, userId: number) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        const post = this.postRepo.create({ text, user });
        return this.postRepo.save(post);
    }

    async findAll() {
        return this.postRepo.find({ relations: ['user'] });
    }

    async findById(postId: number): Promise<Post | undefined> {
        const post = await this.postRepo.findOne({ where: { id: postId }, relations: ['user'] });
        if (!post) {
            throw new NotFoundException(`Post with ID ${postId} not found`);
        }
        return post;
    }

    async deletePost(postId: number): Promise<void> {
        const result = await this.postRepo.delete(postId);
        if (result.affected === 0) {
            throw new NotFoundException(`Post with ID ${postId} not found`);
        }
    }

    async savePost(post: Post) {
        return this.postRepo.save(post);
    }
}
