import { useState } from "react";
import { View, TextInput, Image, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import Button from "../../components/Button";
import type TabParamList from "../../navigation/TabType";
import { createPost } from "../../api/posts";
import { COLORS } from "../recording/constants";

type Props = BottomTabScreenProps<TabParamList, "Post">;

function PostTabScreen({ navigation }: Props) {
  const [content, setContent] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);

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
    if (posting || (!content.trim() && !imageUri)) {
      return;
    }

    setPosting(true);
    try {
      await createPost(content, imageUri);
      setContent("");
      setImageUri(null);
      Alert.alert("投稿しました", "タイムラインに反映されます。");
      navigation.navigate("Home");
    } catch (error) {
      console.error("投稿エラー:", error);
      Alert.alert("投稿に失敗しました", "もう一度お試しください。");
    } finally {
      setPosting(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={content}
        onChangeText={setContent}
        placeholder="投稿内容を入力してください"
        multiline
        style={styles.input}
        placeholderTextColor={COLORS.label}
      />

      <Button
        text="画像を選択"
        onPress={handlePickImage}
        buttonColor={COLORS.white}
        textColor={COLORS.text}
        borderColor={COLORS.border}
        style={styles.button}
      />

      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={styles.preview}
          resizeMode="cover"
        />
      ) : null}

      <Button
        text={posting ? "投稿中..." : "投稿する"}
        onPress={handlePost}
        buttonColor={
          content.trim() || imageUri ? COLORS.primary : COLORS.border
        }
        textColor={COLORS.white}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.white,
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    minHeight: 120,
    fontSize: 15,
    color: COLORS.text,
    textAlignVertical: "top",
  },
  preview: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  button: {
    width: "100%",
  },
});

export default PostTabScreen;

