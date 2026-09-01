import { useState } from "react";
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

  const diff_hh = Math.floor(
    (CurrentTime - PostedAtTime) / (1000 * 60 * 60)
  );

  const diff_mm = Math.floor(
    (CurrentTime - PostedAtTime) / (1000 * 60)
  );

  if (diff_hh >= 24) {
    return PostedAt.toLocaleString("ja-JP", options);
  }

  if (diff_hh >= 1) {
    return `${diff_hh}時間前`;
  }

  return `${diff_mm}分前`;
}

type Props = {
  userId: string;
  content: string;
  postedAt: Date;
  iconImage?: ImageSourcePropType;
  postedImage: ImageSourcePropType;
  likeCount: number;
  liked: boolean;
  onLike: () => void;
};

const CardComponent = (props: Props) => {
  // アバター画像を初回だけランダム生成
  const [randomAvatar] = useState(
    `https://picsum.photos/100/100?random=${Math.random()}`
  );

  // 投稿画像を初回だけランダム生成
  const [randomPostImage] = useState(
    `https://picsum.photos/700/400?random=${Math.random()}`
  );

  // Likeをローカルで管理
  const [liked, setLiked] = useState(props.liked);
  const [likeCount, setLikeCount] = useState(props.liked ? 1 : 0);

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount(0);
    } else {
      setLiked(true);
      setLikeCount(1);
    }
  };

  return (
    <Card
      style={{
        backgroundColor: "transparent",
        marginVertical: 4,
      }}
    >
      <Card.Title
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
        left={(ImageProps) => {
          if (props.iconImage) {
            return (
              <Avatar.Image
                {...ImageProps}
                source={props.iconImage}
                size={36}
              />
            );
          }

          return (
            <Avatar.Image
              {...ImageProps}
              source={{
                uri: randomAvatar,
              }}
              size={36}
            />
          );
        }}
      />

      {/* 投稿画像 */}
      <Card.Cover
        source={{
          uri: randomPostImage,
        }}
        style={{
          height: 150,
        }}
      />

      <Card.Content
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
      </Card.Content>

      <Card.Actions
        style={{
          paddingVertical: 0,
          minHeight: 40,
        }}
      >
        <Button onPress={handleLike} compact>
          {liked ? "♥" : "♡"} {likeCount}
        </Button>
      </Card.Actions>
    </Card>
  );
};

export default CardComponent;