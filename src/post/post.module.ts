import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import {PostRepository} from "./post.repository";
import { JwtModule } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User]),
    JwtModule.register({}),
  ],
  providers: [PostService, PostRepository],
  controllers: [PostController],
  exports: [PostService, PostRepository],
})
export class PostModule {}
