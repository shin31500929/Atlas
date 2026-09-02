import { useState } from "react";
import { Button, FlatList, View } from "react-native";

import HeaderComponent from "../../components/Header";
import PostCard from "../../components/PostCard";

type Post = {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  likeCount: number;
  liked: boolean;
};

function createRandomPost(): Post {
  return {
    id: Math.random().toString(36).substring(2, 10),
    userId: `user_${Math.random().toString(36).substring(2, 8)}`,
    content: Math.random().toString(36).substring(2, 10),
    createdAt: new Date().toISOString(),
    likeCount: 0,
    liked: false,
  };
}

function HomeScreen({ navigation }: any) {
  // 最初に5件生成
  const [posts, setPosts] = useState<Post[]>(() =>
    Array.from({ length: 5 }, createRandomPost),
  );

  // スクロール時に5件追加
  const loadMorePosts = () => {
    const newPosts = Array.from({ length: 5 }, createRandomPost);

    setPosts((currentPosts) => [
      ...currentPosts,
      ...newPosts,
    ]);
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