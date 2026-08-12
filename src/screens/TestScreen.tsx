import ButtonComponent from "../components/Button";
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
      activeOutlineColor="#00fe33"//入力中の枠線の色を指定
      outlineColor="#f40606"//枠線の色を指定
      textColor="#639cdc"//入力文字の色を指定
      placeholderTextColor="#888888"//プレースホルダー文字の色を指定
      backgroundColor="#f9f9f9"
      width={300}
      height={50}
      borderRadius={25}//入力欄の角丸の大きさを指定
      borderVisible={false}//枠線の表示・非表示を切り替え
    />
    </View>
  );
}
