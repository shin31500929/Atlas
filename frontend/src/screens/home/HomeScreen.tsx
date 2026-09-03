import { useCallback, useState } from "react";
import { Button, FlatList, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import HeaderComponent from "../../components/Header";
import PostCard from "../../components/PostCard";
import { getPosts } from "../../api/posts";

type Post = {
  id: string;
  userId: string;
  content: string;
  imagePath: string | null;
  createdAt: string;
  likeCount: number;
  liked: boolean;
};

function createRandomPost(): Post {
  return {
    id: Math.random().toString(36).substring(2, 10),
    userId: `user_${Math.random().toString(36).substring(2, 8)}`,
    content: Math.random().toString(36).substring(2, 10),
    imagePath: `https://picsum.photos/700/400?random=${Math.random()}`,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    liked: false,
  };
}

function HomeScreen({ navigation }: any) {
  const [posts, setPosts] = useState<Post[]>(() =>
    Array.from({ length: 5 }, createRandomPost),
  );

useFocusEffect(
  useCallback(() => {
    const loadBackendPosts = async () => {
      try {
        const data = await getPosts(5, 0);

        const backendPosts: Post[] = data
          .map((post: any) => ({
            id: post.id,
            userId: post.userId ?? "user",
            content: post.content,
            imagePath: post.imagePath,
            createdAt: post.createdAt,
            likeCount: post.likeCount,
            liked: post.liked,
          }))
          .sort(
            (a: Post, b: Post) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime(),
          );

        setPosts((currentPosts) => {
          const randomPosts = currentPosts.filter(
            (post) => !data.some(
              (backendPost: any) =>
                backendPost.id === post.id,
            ),
          );

          return [
            ...backendPosts,
            ...randomPosts,
          ];
        });
      } catch (error) {
        console.error("投稿取得エラー:", error);
      }
    };

    void loadBackendPosts();
  }, []),
);
  const loadMorePosts = () => {
    const newPosts = Array.from({ length: 5 }, createRandomPost);

    setPosts((currentPosts) => [...currentPosts, ...newPosts]);
  };

  const handleLike = (id: string) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) => {
        if (post.id !== id) {
          return post;
        }

        if (post.liked) {
          return {
            ...post,
            liked: false,
            likeCount: 0,
          };
        }

        return {
          ...post,
          liked: true,
          likeCount: 1,
        };
      }),
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderComponent title="TimeLine" />

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            userId={item.userId}
            content={item.content}
            postedAt={new Date(item.createdAt)}
            postedImage={item.imagePath}
            likeCount={item.likeCount}
            liked={item.liked}
            onLike={() => handleLike(item.id)}
          />
        )}
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          <View style={{ padding: 10 }}>
            <Button
              title="投稿する"
              onPress={() => navigation.navigate("Post")}
            />

            <Button
              title="記録する"
              onPress={() => navigation.navigate("Recording")}
            />
          </View>
        }
      />
    </View>
  );
}

export default HomeScreen;
