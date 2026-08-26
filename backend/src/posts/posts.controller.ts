import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Post()
  create(@Body() body: { content: string }) {
    return this.postsService.create(body);
  }

  @Post(':id/likes')
  like(@Param('id') id: string) {
    return this.postsService.like(id);
  }

  @Delete(':id/likes')
  unlike(@Param('id') id: string) {
    return this.postsService.unlike(id);
  }
}
