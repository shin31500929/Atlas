import { View, StyleProp, ViewStyle, Image } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

type IconProps = {
  size?: number;
  imageUri?: string;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
};

const Icon = ({
  size = 60,
  imageUri,
  backgroundColor = "#D9DEDC",
  style,
}: IconProps) => {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        },
        style,
      ]}
    >
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      ) : (
        <MaterialCommunityIcons
          name="account"
          size={size * 0.6}
          color="#6B7974"
        />
      )}
    </View>
  );
};

export default Icon;