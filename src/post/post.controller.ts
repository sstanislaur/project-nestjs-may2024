import { Controller, Get, Post, Body, UseGuards, Req, Delete, Param, ParseIntPipe, Put, Request } from '@nestjs/common';
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
  async createPost(@Body('text') text: string, @Req() req) {
    return this.postService.createPost(text, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deletePost(@Param('id') id: number, @Req() req) {
    return this.postService.deletePost(Number(id), req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updatePost(
      @Param('id', ParseIntPipe) postId: number,
      @Request() req,
      @Body('text') newText: string
  ) {
    const userId = req.user.id;
    return await this.postService.updatePost(postId, userId, newText);
  }

}
