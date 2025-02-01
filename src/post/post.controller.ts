import { Controller, Post, Body, Get } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async create(@Body() body: { text: string; userId: number }) {
    return this.postService.createPost(body.text, body.userId);
  }

  @Get()
  async getAll() {
    return this.postService.getAllPosts();
  }
}
