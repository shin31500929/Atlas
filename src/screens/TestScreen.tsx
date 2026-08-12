import ButtonComponent from "../components/Button";
import { View, Text } from "react-native";

export function TestScreen() {
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
    <ButtonComponent
      text="文字を入力"
      //iconName="pause"//アイコンを表示したい場合はこの行のコメントアウトを外してね
      buttonColor="#EDF1F1"
      textColor="#283D36"
      borderColor="#6B7974"//枠線なしの場合はこの行を消してね
      //width={200}//ボタンの幅を指定したい場合はこの行のコメントアウトを外してね
      //height={50}//ボタンの高さを指定したい場合はこの行のコメントアウトを外してね
      textAlign="center"//ボタン内の文字の位置をleft, center, rightのいずれかで指定してね
      onPress={() => console.log("文字を入力ボタンを押した")}
    />
    </View>
  );
}
