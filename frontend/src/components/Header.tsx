import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as React from "react";
import { Appbar } from "react-native-paper";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

type HeaderComponentProps = {
  title: string;
  onBackPress?: () => void;
  iconName?: React.ComponentProps<typeof MaterialCommunityIcons>["name"]; // titleの右側にアイコンを置いた時用
  onIconPress?: () => void; // 右側アイコンを押したときの処理
  titleStyle?: StyleProp<TextStyle>; // タイトルの文字色を指定するためのプロパティ
  style?: StyleProp<ViewStyle>; // タイトルの文字色を指定するためのプロパティ
};

const HeaderComponent = ({
  title,
  onBackPress,
  iconName,
  onIconPress,
  titleStyle,
  style,
}: HeaderComponentProps) => (
  <Appbar.Header
    style={[{ backgroundColor: "transparent", elevation: 0 }, style]}
  >
    {/* onBackPressが渡されてる画面だけ戻る矢印を出す */}
    {onBackPress && <Appbar.BackAction onPress={onBackPress} color="black" />}

    <Appbar.Content
      title={title}
      titleStyle={[
        {
          textAlign: "center",
          color: "black",
          fontSize: 18,
        },
        titleStyle,
      ]}
    />

    {/* iconNameとonIconPressが両方揃ってる時だけ右側アイコンを出す */}
    {iconName && onIconPress && (
      <Appbar.Action icon={iconName} onPress={onIconPress} color="black" />
    )}
  </Appbar.Header>
);

export default HeaderComponent;
