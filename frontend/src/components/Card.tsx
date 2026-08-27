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

  if (diff_hh >= 24) {
    PassedTime = `${PostedAt.toLocaleString("ja-JP", options)}`;
  } else if (diff_hh >= 1) {
    PassedTime = `${diff_hh.toLocaleString()}時間前`;
  } else {
    PassedTime = `${diff_mm.toLocaleString()}分前`;
  }
  return PassedTime;
}

type Props = {
  userId: string;
  postedAt?: Date;
  image?: ImageSourcePropType;
  text?: string;
  subTitle?: string;
};

const CardComponent = (props: Props) => (
  <Card>
    <Card.Content>
      <Card.Title
        title={props.userId}
        subtitle={props.postedAt ? CalcDiffTime(props.postedAt) : null}
        left={(ImageProps) =>
          props.image ? (
            <Avatar.Image
              {...ImageProps}
              source={props.image ?? { uri: "https://picsum.photos/700" }}
            />
          ) : null
        }
      />
      <Text variant="bodyMedium">{props.text}</Text>
    </Card.Content>
    <Card.Cover source={{ uri: "https://picsum.photos/700" }} />
    <Card.Actions>
      <Button>Cancel</Button>
      <Button>Ok</Button>
    </Card.Actions>
  </Card>
);

export default CardComponent;
