import { Injectable, NotFoundException } from '@nestjs/common';

/** 投稿に紐づく移動記録のサマリ（タイムラインのカード表示に使う） */
export type PostTrip = {
  recordId: string | null;
  distanceKm: number;
  maxSpeedKmh: number;
  elapsedMs: number;
  /** ISO 8601 */
  startedAt: string;
  tags: string[];
};

type Post = {
  id: string;
  content: string;
  imagePath: string | null;
  likeCount: number;
  liked: boolean;
  createdAt: string;
  /** 移動記録から投稿されたものだけ入る。普通の投稿は null */
  trip: PostTrip | null;
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
      trip: null,
    },
  ];

  findAll(limit: number, offset: number) {
    return this.posts.slice(offset, offset + limit);
  }

  create(
    data: { content: string; trip?: PostTrip | string },
    image?: Express.Multer.File,
  ) {
    const post: Post = {
      id: String(this.posts.length + 1),
      content: data.content,
      imagePath: image ? `/posts/${image.filename}` : null,
      likeCount: 0,
      liked: false,
      createdAt: new Date().toISOString(),
      trip: this.normalizeTrip(data.trip),
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

  /**
   * trip を整える。
   * 画像つき投稿は multipart で飛んでくるので、その場合 trip は
   * JSON 文字列になる。オブジェクトでも文字列でも受け取れるようにしておく。
   */
  private normalizeTrip(raw: PostTrip | string | undefined): PostTrip | null {
    if (!raw) {
      return null;
    }

    let value: unknown = raw;

    if (typeof raw === 'string') {
      try {
        value = JSON.parse(raw);
      } catch {
        return null;
      }
    }

    const trip = value as Partial<PostTrip> | null;

    if (!trip || typeof trip !== 'object') {
      return null;
    }

    const toNumber = (input: unknown): number => {
      const num = Number(input);
      return Number.isFinite(num) ? num : 0;
    };

    return {
      recordId: trip.recordId ? String(trip.recordId) : null,
      distanceKm: toNumber(trip.distanceKm),
      maxSpeedKmh: toNumber(trip.maxSpeedKmh),
      elapsedMs: toNumber(trip.elapsedMs),
      startedAt:
        typeof trip.startedAt === 'string' && trip.startedAt.length > 0
          ? trip.startedAt
          : new Date().toISOString(),
      tags: Array.isArray(trip.tags)
        ? trip.tags.filter((tag): tag is string => typeof tag === 'string')
        : [],
    };
  }
}
