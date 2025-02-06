import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async createPost(text: string, userId: number) {
    return this.postRepository.createPost(text, userId);
  }

  async findAll() {
    return this.postRepository.findAll();
  }

  async deletePost(postId: number, userId: number) {
    const post = await this.postRepository.findById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (!post.user || post.user.id === userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.postRepository.deletePost(postId);
    return { message: 'Post deleted successfully' };
  }

}
