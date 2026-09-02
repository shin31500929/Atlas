import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(@Query('limit') limit = '5', @Query('offset') offset = '0') {
    return this.postsService.findAll(Number(limit), Number(offset));
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/posts',
        filename: (_req, file, callback) => {
          const filename = `${Date.now()}${extname(file.originalname)}`;
          callback(null, filename);
        },
      }),
    }),
  )
  create(
    @Body() body: { content: string },
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.postsService.create(body, image);
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
