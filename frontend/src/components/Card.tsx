import { Avatar, Button, Card, Text } from "react-native-paper";

type Props = {
  UserId: string;
  Icon?: string;
};

const CardComponent = (props: Props) => (
  <Card>
    <Card.Content>
      <Card.Title
        title={props.UserId}
        subtitle="Card Subtitle"
        left={(iconProps) =>
          props.Icon ?? (
            <Avatar.Icon
              {...iconProps}
              icon={props.Icon ?? { uri: "https://picsum.photos/700" }}
            />
          )
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
