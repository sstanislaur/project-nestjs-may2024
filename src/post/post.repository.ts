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
        return await this.repo.find({ relations: ['user'] });
    }


    async findById(postId: number) {
        console.log(`Searching for post with ID: ${postId}`);
        const post = await this.repo.findOne({ where: { id: postId }, relations: ['user'] });

        if (!post) {
            console.log(`Post with ID ${postId} not found`);
        } else {
            console.log(`Found post:`, post);
        }

        return post;
    }


    async deletePost(postId: number) {
        return await this.repo.delete(postId);
    }
}
