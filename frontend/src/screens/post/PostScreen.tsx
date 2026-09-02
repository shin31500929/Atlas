import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type RootStackParamList from "../../navigation/type";
import { createPost } from "../../api/posts";

type Props = NativeStackScreenProps<RootStackParamList, "Post">;

function PostScreen({ navigation }: Props) {
  const [content, setContent] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handlePickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handlePost = async () => {
    if (!content.trim() && !imageUri) {
      return;
    }

    try {
      const newPost = await createPost(content, imageUri);

      console.log("投稿成功:", newPost);

      setContent("");
      setImageUri(null);

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
        title="画像を選択"
        onPress={handlePickImage}
      />

      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{
            width: "100%",
            height: 250,
            marginTop: 20,
            marginBottom: 20,
          }}
          resizeMode="cover"
        />
      )}

      <Button
        title="投稿する"
        onPress={handlePost}
      />
    </View>
  );
}

export default PostScreen;