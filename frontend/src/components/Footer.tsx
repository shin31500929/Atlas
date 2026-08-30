import { NavigationContainer } from "@react-navigation/native";

function FooterComponent() {
  return (
    <NavigationContainer
      onStateChange={(state) => console.log(`New state is`, state)}
    >
      {" "}
      {/* ここ文字なんと書けます！ */}
    </NavigationContainer>
  );
}
