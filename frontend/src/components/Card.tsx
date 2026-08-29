import { View, StyleProp, ViewStyle } from "react-native";

type CardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const Card = ({ children, style }: CardProps) => {
  return (
    <View
      style={[
        {
          borderColor: "#8f9995",
        },
        style,
        ]}
    >
      {children}
    </View>
  );
};

export default Card;