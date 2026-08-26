import { ImageSourcePropType } from "react-native";
import { Avatar, Button, Card, Text } from "react-native-paper";

type Props = {
  UserId: string;
  Image?: ImageSourcePropType;
};

const CardComponent = (props: Props) => (
  <Card>
    <Card.Content>
      <Card.Title
        title={props.UserId}
        subtitle="Card Subtitle"
        left={(ImageProps) =>
          props.Image ? (
            <Avatar.Image
              {...ImageProps}
              source={props.Image ?? { uri: "https://picsum.photos/700" }}
            />
          ) : null
        }
      />
      <Text variant="bodyMedium">bodyMedium</Text>
    </Card.Content>
    <Card.Cover source={{ uri: "https://picsum.photos/700" }} />
    <Card.Actions>
      <Button>Cancel</Button>
      <Button>Ok</Button>
    </Card.Actions>
  </Card>
);

export default CardComponent;
