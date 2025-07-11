import Button from "@/components/Button";
import { Stack, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: "Page Not Found!" }} />
      <View style={styles.container}>
        <Button
          label="Back to Home Page"
          onPress={() => router.navigate("/")}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#fff",
  },
});
