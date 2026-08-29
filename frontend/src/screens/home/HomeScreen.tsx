import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useState } from "react";
import { Button, FlatList, Text, View } from "react-native";
import { getPosts, likePost, unlikePost } from "../../api/posts";
import type RootStackParamList from "../../navigation/type";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

type Post = {
  id: string;
  content: string;
  likeCount: number;
  liked: boolean;
  createdAt: string;
};

function HomeScreen({ navigation }: Props) {
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = useCallback(async () => {
    try {
      const data = await getPosts();
      console.log("posts:", data);
      setPosts(data);
    } catch (error) {
      console.error("APIエラー:", error);
    }
  }, []);

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

  return (
    <View>
      <Text>Home</Text>

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
      />
    </View>
  );
}

export default HomeScreen;
