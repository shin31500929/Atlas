import LoadingComponent from "../components/Loading";
import { View, Text } from "react-native";

function TestScreen() {
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
    <LoadingComponent 
      //color="#25b1ac"　//色を指定可能 
      //size="large"   //サイズを指定"large"　または　"small"　または　{数値}　で指定可能
    />
    </View>
  );
}

export default TestScreen;