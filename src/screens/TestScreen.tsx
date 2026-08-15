import { View, Text } from "react-native";
import Input from "../components/Input";
import { useState } from "react";

export function TestScreen() {
  const [name, setName] = useState("");

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Test</Text>
    {/*componentsのテスト*/}

    <Input
      placeholder="文字を入力"
      value={name}
      onChangeText={setName}
      activeOutlineColor="#0000ff"//入力中の枠線の色を指定
      outlineColor="#ff0000"//枠線の色を指定
      textColor="#283D36"//入力文字の色を指定
      placeholderTextColor="#888888"//プレースホルダー文字の色を指定
      backgroundColor="#f9f9f9"//背景色を指定
      style={{
        width: 300,
        height: 50,
      }}
      outlineStyle={{
        borderRadius: 25,
      }}
    />
    </View>
  );
}
