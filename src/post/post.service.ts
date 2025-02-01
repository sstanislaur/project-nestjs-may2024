import { Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async createPost(text: string, userId: number) {
    return this.postRepository.createPost(text, userId);
  }

  async getAllPosts() {
    return this.postRepository.findAll();
  }
}
