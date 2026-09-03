import { useState } from "react";
import { ImageSourcePropType } from "react-native";
import { Avatar, Button, Card as PaperCard, Text } from "react-native-paper";

function CalcDiffTime(postedAt: Date) {
  const options = {
    weekday: "short" as const,
    year: "numeric" as const,
    month: "long" as const,
    day: "numeric" as const,
  };

  const now = new Date();
  const currentTime = now.getTime();
  const postedAtTime = postedAt.getTime();

  const diffHh = Math.floor((currentTime - postedAtTime) / (1000 * 60 * 60));

  const diffMm = Math.floor((currentTime - postedAtTime) / (1000 * 60));

  if (diffHh >= 24) {
    return postedAt.toLocaleString("ja-JP", options);
  }

  if (diffHh >= 1) {
    return `${diffHh}時間前`;
  }

  return `${diffMm}分前`;
}

type Props = {
  userId: string;
  content: string;
  postedAt: Date;
  iconImage?: ImageSourcePropType;
  postedImage?: string | null;
  likeCount: number;
  liked: boolean;
  onLike: () => void;
};

const PostCard = (props: Props) => {
  const [randomAvatar] = useState(
    `https://picsum.photos/100/100?random=${Math.random()}`,
  );

  const imageUri = props.postedImage
    ? props.postedImage.startsWith("http")
      ? props.postedImage
      : `http://localhost:3000${props.postedImage}`
    : null;

  return (
    <PaperCard
      style={{
        backgroundColor: "transparent",
        marginVertical: 4,
      }}
    >
      <PaperCard.Title
        title={props.userId}
        subtitle={CalcDiffTime(props.postedAt)}
        titleStyle={{
          fontSize: 14,
        }}
        subtitleStyle={{
          fontSize: 11,
        }}
        leftStyle={{
          marginRight: 10,
          marginHorizontal: 0,
        }}
        left={(imageProps) => {
          if (props.iconImage) {
            return (
              <Avatar.Image
                {...imageProps}
                source={props.iconImage}
                size={36}
              />
            );
          }

          return (
            <Avatar.Image
              {...imageProps}
              source={{
                uri: randomAvatar,
              }}
              size={36}
            />
          );
        }}
      />

      {imageUri && (
        <PaperCard.Cover
          source={{
            uri: imageUri,
          }}
          style={{
            height: 150,
          }}
        />
      )}

      <PaperCard.Content
        style={{
          paddingVertical: 6,
        }}
      >
        <Text
          variant="bodyMedium"
          style={{
            color: "black",
            fontSize: 13,
          }}
        >
          {props.content}
        </Text>
      </PaperCard.Content>

      <PaperCard.Actions
        style={{
          paddingVertical: 0,
          minHeight: 40,
        }}
      >
        <Button onPress={props.onLike} compact>
          {props.liked ? "♥" : "♡"} {props.likeCount}
        </Button>
      </PaperCard.Actions>
    </PaperCard>
  );
};

export default PostCard;
