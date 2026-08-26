import { ImageSourcePropType } from "react-native";
import { Avatar, Button, Card, Text } from "react-native-paper";

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

  diff_hh > 24
    ? (PassedTime = `${PostedAt.toLocaleString("ja-JP", options)}`)
    : 24 > diff_hh && diff_hh >= 1
      ? (PassedTime = `${diff_hh.toLocaleString()}時間前`)
      : (PassedTime = `${diff_mm.toLocaleString()}分前`);
  return PassedTime;
}

type Props = {
  UserId: string;
  PostedAt?: Date;
  Image?: ImageSourcePropType;
  Text?: string;
  SubTitle?: string;
};

const CardComponent = (props: Props) => (
  <Card>
    <Card.Content>
      <Card.Title
        title={props.UserId}
        subtitle={props.PostedAt ? CalcDiffTime(props.PostedAt) : null}
        left={(ImageProps) =>
          props.Image ? (
            <Avatar.Image
              {...ImageProps}
              source={props.Image ?? { uri: "https://picsum.photos/700" }}
            />
          ) : null
        }
      />
      <Text variant="bodyMedium">{props.Text}</Text>
    </Card.Content>
    <Card.Cover source={{ uri: "https://picsum.photos/700" }} />
    <Card.Actions>
      <Button>Cancel</Button>
      <Button>Ok</Button>
    </Card.Actions>
  </Card>
);

export default CardComponent;
