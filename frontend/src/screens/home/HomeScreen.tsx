import { useCallback, useState } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import HeaderComponent from "../../components/Header";
import PostCard from "../../components/PostCard";
import Button from "../../components/Button";
import { COLORS } from "../recording/constants";
import { getPosts, type PostTrip } from "../../api/posts";
import type RootStackParamList from "../../navigation/type";
import type TabParamList from "../../navigation/TabType";

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "Home">,
  NativeStackScreenProps<RootStackParamList>
>;

type Post = {
  id: string;
  userId: string;
  content: string;
  imagePath: string | null;
  createdAt: string;
  likeCount: number;
  liked: boolean;
  trip: PostTrip | null;
};

function HomeScreen({ navigation }: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const load = async () => {
        setLoading(true);
        try {
          const backendPosts = await getPosts(20, 0).catch(() => []);
          if (!active) {
            return;
          }

          const mapped: Post[] = (backendPosts as any[])
            .map((p: any) => ({
              id: p.id,
              userId: p.userId ?? "user",
              content: p.content,
              imagePath: p.imagePath,
              createdAt: p.createdAt,
              likeCount: p.likeCount ?? 0,
              liked: p.liked ?? false,
              trip: p.trip ?? null,
            }))
            .sort(
              (a: Post, b: Post) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            );

          setPosts(mapped);
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      };

      load();
      return () => {
        active = false;
      };
    }, []),
  );

  const handleLike = (id: string) => {
    setPosts((current) =>
      current.map((post) => {
        if (post.id !== id) {
          return post;
        }
        return {
          ...post,
          liked: !post.liked,
          likeCount: post.liked ? post.likeCount - 1 : post.likeCount + 1,
        };
      }),
    );
  };

  return (
    <View style={styles.container}>
      {/* <HeaderComponent title=""/> */}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.postButtonWrap}>
              {/* <Button
                text="投稿する"
                onPress={() => navigation.navigate("Post")}
                buttonColor={COLORS.primary}
                textColor={COLORS.white}
                iconName="pencil"
                style={styles.postButton}
              /> */}
            </View>
          }
          ListEmptyComponent={
            <Text style={styles.empty}>まだ投稿がありません</Text>
          }
          renderItem={({ item }) => (
            <PostCard
              userId={item.userId}
              content={item.content}
              postedAt={new Date(item.createdAt)}
              postedImage={item.imagePath}
              likeCount={item.likeCount}
              liked={item.liked}
              trip={item.trip}
              onOpenTrip={
                item.trip?.recordId
                  ? () =>
                      navigation.navigate("RecordingMap", {
                        recordId: item.trip?.recordId ?? undefined,
                      })
                  : undefined
              }
              onLike={() => handleLike(item.id)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  postButtonWrap: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  postButton: {
    width: "100%",
  },
  listContent: {
    paddingBottom: 24,
  },
  empty: {
    fontSize: 13,
    color: COLORS.label,
    textAlign: "center",
    paddingVertical: 24,
  },
});

export default HomeScreen;
