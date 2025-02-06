import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class PostRepository {
    constructor(
        @InjectRepository(Post) private postRepo: Repository<Post>,
        @InjectRepository(User) private userRepo: Repository<User>
    ) {}

    async createPost(text: string, userId: number) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new Error('User not found');

        const post = this.postRepo.create({ text, user });
        return await this.postRepo.save(post);
    }

    async findAll() {
        return await this.postRepo.find({ relations: ['user'] });
    }


    async findById(postId: number) {
        console.log(`Searching for post with ID: ${postId}`);
        const post = await this.postRepo.findOne({ where: { id: postId }, relations: ['user'] });

        if (!post) {
            console.log(`Post with ID ${postId} not found`);
        } else {
            console.log(`Found post:`, post);
        }

        return post;
    }

    async deletePost(postId: number) {
        return await this.postRepo.delete(postId);
    }

    async savePost(post: Post) {
        return await this.postRepo.save(post);
    }

}
