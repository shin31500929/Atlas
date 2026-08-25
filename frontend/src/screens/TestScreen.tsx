import { View, Text } from "react-native";
import Input from "../components/Input";
import { useState } from "react";

function TestScreen() {
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
        placeholder="文字を入力"  //入力欄の中の文字を指定
        value={name}  //入力欄に現在表示する文字列を指定
        onChangeText={setName}  //入力された文字が変化したときに呼び出す関数を指定
        activeOutlineColor="#6b7974"  //入力欄がアクティブになった時の枠線の色を指定
        outlineColor="#a8bab2"  //入力欄がアクティブでない時の枠線の色を指定
        textColor="#283D36" //入力欄の中の文字の色を指定
        placeholderTextColor="#888888"  //入力欄の中の文字がない時の文字の色を指定
        backgroundColor="#f9f9f9" //入力欄の背景色を指定
        style={{
          width: 300,
          height: 50,
        }}//入力欄の大きさを指定
        outlineStyle={{
          borderRadius: 25,
        }}//入力欄の枠線の角の丸みを指定
      />
    </View>
  );
}

export default TestScreen;
