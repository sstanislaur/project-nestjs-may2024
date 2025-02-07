import { Controller, Get, Post, Body, UseGuards, Req, Delete, Param, ParseIntPipe, Put, Request, BadRequestException } from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async findAll() {
    return this.postService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPost(
      @Body('text') text: string,
      @Request() req,
  ) {
    if (!text || text.trim().length === 0) {
      throw new BadRequestException('Post text cannot be empty');
    }

    return this.postService.createPost(text, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deletePost(
      @Param('id', ParseIntPipe) id: number,
      @Request() req,
  ) {
    const userId = req.user.id;
    return this.postService.deletePost(id, userId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updatePost(
      @Param('id', ParseIntPipe) postId: number,
      @Request() req,
      @Body('text') newText: string,
  ) {
    const userId = req.user.id;

    if (!newText || newText.trim().length === 0) {
      throw new BadRequestException('Post text cannot be empty');
    }

    return this.postService.updatePost(postId, userId, newText);
  }
}
