import { Injectable, NotFoundException } from '@nestjs/common';

type Post = {
  id: string;
  content: string;
  imagePath: string | null;
  likeCount: number;
  liked: boolean;
  createdAt: string;
};

@Injectable()
export class PostsService {
  private posts: Post[] = [
    {
      id: '1',
      content: '東京を散策しました',
      imagePath: null,
      likeCount: 0,
      liked: false,
      createdAt: new Date().toISOString(),
    },
  ];

  findAll(limit: number, offset: number) {
    return this.posts.slice(offset, offset + limit);
  }

  create(data: { content: string }, image?: Express.Multer.File) {
    const post: Post = {
      id: String(this.posts.length + 1),
      content: data.content,
      imagePath: image ? `/posts/${image.filename}` : null,
      likeCount: 0,
      liked: false,
      createdAt: new Date().toISOString(),
    };

    this.posts.push(post);

    return post;
  }

  like(id: string) {
    const post = this.posts.find((post) => post.id === id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    post.likeCount += 1;
    post.liked = true;

    return post;
  }

  unlike(id: string) {
    const post = this.posts.find((post) => post.id === id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.likeCount > 0) {
      post.likeCount -= 1;
    }

    post.liked = false;

    return post;
  }
}
