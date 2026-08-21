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
        placeholder="文字を入力"
        value={name}
        onChangeText={setName}
        activeOutlineColor="#0000ff"
        outlineColor="#ff0000"
        textColor="#283D36"
        placeholderTextColor="#888888"
        backgroundColor="#f9f9f9"
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

export default TestScreen;
