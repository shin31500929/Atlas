import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { View, Text } from "react-native";
import type TabParamList from "../../navigation/TabType";
import Iconcomponent from "../../components/Icon";
import HeaderComponent from "../../components/Header";
import CardComponent from "../../components/Card";
import FooterComponent from "@/components/Footer";
import ButtonComponent from "@/components/Button";
import PostComponent from "@/components/PostCard";

type Props = BottomTabScreenProps<TabParamList, "Profile">;

function ProfileScreen({ navigation }: Props) {
  return (
    <View style={{ flex: 1 }}>
      <View>
        <HeaderComponent
          title=""
          style={{ backgroundColor: "transparent", elevation: 0 }}
          onBackPress={() => navigation.goBack()}
          iconName="dots-vertical"
          onIconPress={() => console.log("Icon pressed")}
        />
      </View>

      <View
        style={{
          alignItems: "center",
          marginTop: -40,
        }}
      >
        <Iconcomponent
          size={100}
          imageUri="https://images.unsplash.com/photo-1682685794700-1f3c7e5d8b4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
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
      >
        <Text>a</Text>
      </View>
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
          <text style={{ textAlign: "center" }}>km/h</text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          paddingHorizontal: 20,
          marginTop: 5,
        }}
      >
        <View
          style={{
            width: "30%",
            height: 45,
            borderColor: "#8f9995",
            borderWidth: 1,
            borderRadius: 10,
            padding: 10,
          }}
        >
          <Text style={{ textAlign: "center" }}>投稿</Text>
        </View>

        <View
          style={{
            width: "30%",
            height: 45,
            borderColor: "#8f9995",
            borderWidth: 1,
            borderRadius: 10,
            padding: 10,
          }}
        >
          <Text style={{ textAlign: "center" }}>いいね</Text>
        </View>
        <View
          style={{
            width: "30%",
            height: 45,
            borderColor: "#8f9995",
            borderWidth: 1,
            borderRadius: 10,
            padding: 10,
          }}
        >
          <Text style={{ textAlign: "center" }}>保存済み</Text>
        </View>
      </View>
      <FooterComponent />
          
    </View>
  );
}

export default ProfileScreen;
