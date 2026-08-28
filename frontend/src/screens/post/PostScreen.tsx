import { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type RootStackParamList from "../../navigation/type";
import { createPost } from "../../api/posts";

type Props = NativeStackScreenProps<RootStackParamList, "Post">;

function PostScreen({ navigation }: Props) {
  const [content, setContent] = useState("");

  const handlePost = async () => {
    if (!content.trim()) {
      return;
    }

    try {
      const newPost = await createPost(content);

      console.log("投稿成功:", newPost);

      setContent("");
      navigation.goBack();
    } catch (error) {
      console.error("投稿エラー:", error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
      }}
    >
      <Text>投稿</Text>

      <TextInput
        value={content}
        onChangeText={setContent}
        placeholder="投稿内容を入力してください"
        multiline
        style={{
          borderWidth: 1,
          padding: 10,
          marginTop: 20,
          marginBottom: 20,
          minHeight: 100,
        }}
      />

      <Button
        title="投稿する"
        onPress={handlePost}
      />
    </View>
  );
}

export default PostScreen;