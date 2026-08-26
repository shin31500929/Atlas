import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class PostsService {
  private posts = [
    {
      id: '1',
      content: '東京を散策しました',
      likeCount: 0,
      liked: false,
      createdAt: new Date().toISOString(),
    },
  ];

  findAll() {
    return this.posts;
  }

  create(data: { content: string }) {
    const post = {
      id: String(this.posts.length + 1),
      content: data.content,
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
