import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Text, View } from "react-native";
import type RootStackParamList from "../../navigation/type";

type Props = NativeStackScreenProps<RootStackParamList, "Search">;

function SearchScreen({ navigation }: Props) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Serch</Text>
    </View>
  );
}

export default SearchScreen;
