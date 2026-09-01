import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useState } from "react";
import { Button, FlatList, Text, View } from "react-native";
import { getPosts, likePost, unlikePost } from "../../api/posts";
import HeaderComponent from "../../components/Header";
import PostCard from "../../components/PostCard";
import type RootStackParamList from "../../navigation/type";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

type Post = {
  id: string;
  content: string;
  likeCount: number;
  liked: boolean;
  createdAt: string;
};

const LIMIT = 5;

function HomeScreen({ navigation }: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(async () => {
    if (loading || !hasMore) {
      return;
    }

    setLoading(true);

    try {
      const data = await getPosts(LIMIT, offset);

      setPosts((currentPosts) => [...currentPosts, ...data]);

      if (data.length < LIMIT) {
        setHasMore(false);
      } else {
        setOffset((currentOffset) => currentOffset + LIMIT);
      }
    } catch (error) {
      console.error("APIエラー:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, offset]);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [fetchPosts]),
  );

  const handleLike = async (post: Post) => {
    try {
      const updatedPost = post.liked
        ? await unlikePost(post.id)
        : await likePost(post.id);

      setPosts((currentPosts) =>
        currentPosts.map((item) => (item.id === post.id ? updatedPost : item)),
      );
    } catch (error) {
      console.error("いいねエラー:", error);
    }
  };

  const randomString = Math.random().toString(36).substring(2, 10);

  const randomUserId = `user_${Math.random().toString(36).substring(2, 8)}`;

  return (
    <View style={{ flex: 1 }}>
      <HeaderComponent title="TimeLine" />
      <Text>タイムライン</Text>

      <PostCard
        userId={randomUserId}
        content={randomString}
        postedAt={new Date()}
        postedImage={{
        }}
        likeCount={0}
        liked={false}
        onLike={() => console.log("いいねボタンが押されました")}
      />

      <Button title="投稿する" onPress={() => navigation.navigate("Post")} />

      <Button
        title="記録する"
        onPress={() => navigation.navigate("Recording")}
      />

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.content}</Text>

            <Text>いいね: {item.likeCount}</Text>

            <Button
              title={item.liked ? "いいね解除" : "いいね"}
              onPress={() => handleLike(item)}
            />
          </View>
        )}
        onEndReached={fetchPosts}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}

export default HomeScreen;
