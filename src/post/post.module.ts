import {Module} from '@nestjs/common';
import {Post} from './entities/post.entity';
import {User} from '../user/entities/user.entity';
import {PostService} from './post.service';
import {PostController} from './post.controller';
import {PostRepository} from "./post.repository";
import {TypeOrmModule} from '@nestjs/typeorm';
import {JwtModule} from '@nestjs/jwt';


@Module({
    imports: [TypeOrmModule.forFeature([Post, User]),
        JwtModule.register({}),
    ],
    providers: [PostService, PostRepository],
    controllers: [PostController],
    exports: [PostService, PostRepository],
})
export class PostModule {
}
