import { useState } from "react";
import { ImageSourcePropType, View, StyleSheet, Pressable } from "react-native";
import { Avatar, Button, Card as PaperCard, Text } from "react-native-paper";
import type { PostTrip } from "../api/posts";
import { COLORS } from "../screens/recording/constants";
import {
  formatDistance,
  formatElapsedTime,
  formatSpeed,
} from "../screens/recording/utils";

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
  /** 移動記録から投稿されたものだけ入る */
  trip?: PostTrip | null;
  /** 移動記録の詳細を開く。記録が辿れる投稿だけ渡される */
  onOpenTrip?: () => void;
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

        {/* 移動記録から投稿されたものは、距離・最高速度・移動時間を出す。
            記録が辿れる場合はタップで詳細（地図つき）へ */}
        {props.trip ? (
          <Pressable
            onPress={props.onOpenTrip}
            disabled={!props.onOpenTrip}
            style={({ pressed }) => [
              styles.tripBox,
              props.onOpenTrip && pressed ? styles.tripBoxPressed : null,
            ]}
          >
            <View style={styles.tripStatsRow}>
              <Text style={styles.tripStat}>
                {formatDistance(props.trip.distanceKm)} km
              </Text>
              <Text style={styles.tripDot}>·</Text>
              <Text style={styles.tripStat}>
                最高 {formatSpeed(props.trip.maxSpeedKmh)} km/h
              </Text>
              <Text style={styles.tripDot}>·</Text>
              <Text style={styles.tripStat}>
                {formatElapsedTime(props.trip.elapsedMs)}
              </Text>
            </View>
            {props.trip.tags && props.trip.tags.length > 0 ? (
              <Text style={styles.tripTags} numberOfLines={1}>
                {props.trip.tags.map((tag) => `#${tag}`).join(" ")}
              </Text>
            ) : null}
            {props.onOpenTrip ? (
              <Text style={styles.tripLink}>移動の詳細を見る ›</Text>
            ) : null}
          </Pressable>
        ) : null}
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

const styles = StyleSheet.create({
  tripBox: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
    backgroundColor: COLORS.white,
  },
  tripStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 4,
  },
  tripStat: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: "600",
  },
  tripDot: {
    fontSize: 13,
    color: COLORS.border,
  },
  tripBoxPressed: {
    backgroundColor: COLORS.gpsBadgeBg,
  },
  tripTags: {
    fontSize: 12,
    color: COLORS.primary,
  },
  tripLink: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primary,
    marginTop: 2,
  },
});

export default PostCard;
