import ButtonComponent from "@/components/Button";
import FooterComponent from "@/components/Footer";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { Text, View } from "react-native";
import HeaderComponent from "../../components/Header";
import Iconcomponent from "../../components/Icon";
import ProfileTab from "../../navigation/Profiletab";
import type TabParamList from "../../navigation/TabType";

type Props = BottomTabScreenProps<TabParamList, "Profile">;

function ProfileScreen({ navigation }: Props) {
  return (
    // todo:onBackPressが渡されているのに、動かない件
    // todo:そばにより解決。当たり判定の問題。IconをくくるViewを下に下げる。
    <View style={{ flex: 1 }}>
      <View>
        <HeaderComponent
          title=""
          style={{ backgroundColor: "transparent", elevation: 0 }}
          onBackPress={() => navigation.goBack()}
        />
      </View>

      <View
        style={{
          alignItems: "center",
          marginTop: -30,
        }}
      >
        <Iconcomponent
          size={100}
          imageUri="https://images.unsplash.com/photo-1682685794700-1f3c7e5d8b4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
          style={{ marginTop: 100 }}
        />
      </View>

      <View
        style={{
          alignItems: "center",
          marginTop: 5,
        }}
      >
        <Text>a</Text>
      </View>
      <View
        style={{
          alignItems: "center",
          marginTop: 5,
        }}
      ></View>
      <View
        style={{
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <ButtonComponent
          textColor="white"
          text="プロフィールを編集"
          onPress={() => console.log("プロフィールを編集")}
          buttonColor="#138581"
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          paddingHorizontal: 70,
          marginTop: 20,
        }}
      >
        <View
          style={{
            width: "45%",
            height: 100,
            borderColor: "#8f9995",
            borderWidth: 1,
            borderRadius: 10,
            padding: 10,
          }}
        >
          <Text style={{ textAlign: "center" }}>総移動距離</Text>
          <Text style={{ textAlign: "center", fontSize: 30 }}>0.0</Text>
          <Text style={{ textAlign: "center" }}>km</Text>
        </View>

        <View
          style={{
            width: "45%",
            height: 100,
            borderColor: "#8f9995",
            borderWidth: 1,
            borderRadius: 10,
            padding: 10,
          }}
        >
          <Text style={{ textAlign: "center" }}>最高速度</Text>
          <Text style={{ textAlign: "center", fontSize: 30 }}>0.0</Text>
          <Text style={{ textAlign: "center" }}>km/h</Text>
        </View>
      </View>

      <ProfileTab />

      <View>
        <FooterComponent></FooterComponent>
      </View>
    </View>
  );
}

export default ProfileScreen;
