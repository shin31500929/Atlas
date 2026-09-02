import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(@Query('limit') limit = '5', @Query('offset') offset = '0') {
    return this.postsService.findAll(Number(limit), Number(offset));
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
