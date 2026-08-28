import { ImageSourcePropType } from "react-native";
import { Avatar, Button, Card } from "react-native-paper";

function CalcDiffTime(PostedAt: Date) {
  const options = {
    weekday: "short" as const,
    year: "numeric" as const,
    month: "long" as const,
    day: "numeric" as const,
  };
  const now = new Date();
  const CurrentTime = now.getTime();
  const PostedAtTime = PostedAt.getTime();
  let PassedTime: string = "";
  let diff_hh = Math.floor((CurrentTime - PostedAtTime) / (1000 * 60 * 60));
  let diff_mm = Math.floor((CurrentTime - PostedAtTime) / (1000 * 60));
  // todo: 投稿日時表示がちょうど24時間前の場合の条件分岐

  if (diff_hh >= 24) {
    PassedTime = `${PostedAt.toLocaleString("ja-JP", options)}`;
  } else if (diff_hh >= 1) {
    PassedTime = `${diff_hh.toLocaleString()}時間前`;
  } else {
    PassedTime = `${diff_mm.toLocaleString()}分前`;
  }
  return PassedTime;
}

// todo: カードの機能をアイコン,投稿画像,タイトル,投稿日時表示の4つに絞ってそれ以外をコメントアウト（テキストなど）
type Props = {
  userId: string; // ユーザID
  postedAt: Date; //　投稿日時
  iconImage?: ImageSourcePropType; // アイコン
  postedImage: ImageSourcePropType; // 投稿画像
  title: string; // タイトル
  // text?: string;
};

const CardComponent = (props: Props) => (
  <Card>
    <Card.Content>
      <Card.Title
        title={props.userId}
        subtitle={props.postedAt ? CalcDiffTime(props.postedAt) : null}
        left={(ImageProps) => {
          if (props.iconImage) {
            <Avatar.Image {...ImageProps} source={props.iconImage} />;
          } else {
            <Avatar.Image
              {...ImageProps}
              source={{ uri: "https://picsum.photos/700" }}
            />;
          }
        }}
      />
      {/* <Text variant="bodyMedium">{props.text}</Text> */}
    </Card.Content>
    <Card.Cover source={props.postedImage} />
    <Card.Actions>
      <Button>Cancel</Button>
      <Button>Ok</Button>
    </Card.Actions>
  </Card>
);
// todo: 下部のcancel,okのボタンにonpressを追加して何か表示できるようにしておいてもらえると,後々動作確認で楽になるのでやって欲しい

export default CardComponent;
