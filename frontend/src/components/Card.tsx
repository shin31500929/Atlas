import { ImageSourcePropType } from "react-native";
import { Avatar, Button, Card, Text } from "react-native-paper";

function CalcDiffTime(PostedAt: Date) {
  const now = new Date();
  const CurrentTime = now.getTime();
  const PostedAtTime = PostedAt.getTime();
  let PassedHour = 0;
  let diff = (CurrentTime - PostedAtTime) / (1000 * 60 * 60);
  let diff_mm = ()

  diff > 24 ? (PassedHour = PostedAtTime) : (PassedHour = diff);
  return PassedHour;
}

type Props = {
  UserId: string;
  PostedAt: Date;
  Image?: ImageSourcePropType;
  Text?: string;
  SubTitle?: string;
};

const CardComponent = (props: Props) => (
  <Card>
    <Card.Content>
      <Card.Title
        title={props.UserId}
        subtitle={CalcDiffTime(props.PostedAt)}
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
