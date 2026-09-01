import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as React from "react";
import { Appbar } from "react-native-paper";

type HeaderComponentProps = {
  title: string;
  onBackPress?: () => void;
  iconName?: React.ComponentProps<typeof MaterialCommunityIcons>["name"]; // titleの右側にアイコンを置いた時用
  onIconPress?: () => void; // 右側アイコンを押したときの処理
};

const HeaderComponent = ({
  title,
  onBackPress,
  iconName,
  onIconPress,
}: HeaderComponentProps) => (
  <Appbar.Header>
    {/* onBackPressが渡されてる画面だけ戻る矢印を出す */}
    {onBackPress && <Appbar.BackAction onPress={onBackPress} />}

    <Appbar.Content
      title={title}
      titleStyle={{
        textAlign: "center",
        backgroundColor: "White",
        color: "black",
        fontSize: 18,
      }}
    />

    {/* iconNameとonIconPressが両方揃ってる時だけ右側アイコンを出す */}
    {iconName && onIconPress && (
      <Appbar.Action icon={iconName} onPress={onIconPress} />
    )}
  </Appbar.Header>
);

export default HeaderComponent;
