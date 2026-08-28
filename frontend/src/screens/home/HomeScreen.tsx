// import { View, Text, Button } from "react-native";
// import type { NativeStackScreenProps } from "@react-navigation/native-stack";
// import type RootStackParamList from "../../navigation/type";

// type Props = NativeStackScreenProps<RootStackParamList, "Home">;

// function HomeScreen({ navigation }: Props) {
//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Text>Atlas</Text>
//       <Button title="Go to Post" onPress={() => navigation.navigate("Post")} />
//       <Button title="Go to Profile" onPress={() => navigation.navigate("Profile")} />
//       <Button title="Go to Login" onPress={() => navigation.navigate("Login")} />
//       <Button title="Go to Recording" onPress={() => navigation.navigate("Recording")} />
//       <Button title="Go to Confirm" onPress={() => navigation.navigate("Confirm")} />
//       <Button title="Go to RecordingMap" onPress={() => navigation.navigate("RecordingMap")} />
//       <Button title="Go to Test" onPress={() => navigation.navigate("Test")} />
//     </View>
//   );
// }

// export default HomeScreen;


import React, { useEffect } from "react";
import { View, Text } from "react-native";
import {
  createPost,
  getPosts,
  likePost,
  unlikePost,
} from "../../api/posts";
import {
  getRecords,
  createRecord,
} from "../../api/records";

export default function HomeScreen() {
  useEffect(() => {
    const testApi = async () => {
      try {
        // Posts
        const posts = await getPosts();
        console.log("posts:", posts);

        const newPost = await createPost("Frontendからの投稿");
        console.log("newPost:", newPost);

        const likedPost = await likePost(newPost.id);
        console.log("likedPost:", likedPost);

        const unlikedPost = await unlikePost(newPost.id);
        console.log("unlikedPost:", unlikedPost);

        // Records
        const records = await getRecords();
        console.log("records:", records);

        const newRecord = await createRecord(
          "Frontendからの記録",
          new Date().toISOString(),
        );
        console.log("newRecord:", newRecord);
      } catch (error) {
        console.error("APIエラー:", error);
      }
    };

    testApi();
  }, []);

  return (
    <View>
      <Text>Home</Text>
    </View>
  );
}