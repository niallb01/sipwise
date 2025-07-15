import { Text, View, StyleSheet } from "react-native";
import Button from "@/components/Button";
import { useRouter } from "expo-router";

export default function CheckInModal() {
  const router = useRouter();

  const onCurrentStatus = () => {
    // router.back();
    // router.navigate("/(tabs)/current");
    // router.replace("/(tabs)/current");
    setTimeout(() => {
      router.replace("/(tabs)/current");
    }, 10); // tweak delay time as needed
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Did You Have An Alcohol Free Day Yesterday?
      </Text>
      <View style={styles.btnContainer}>
        <Button label="Yes" onPress={onCurrentStatus} />
        <Button label="No" onPress={onCurrentStatus} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btnContainer: {
    flexDirection: "row", // Arrange children horizontally
    justifyContent: "center", // Center buttons horizontally within container
    alignItems: "center", // Align buttons vertically centered
    gap: 10, // Optional: space between buttons (supported in some environm
  },
  header: {
    fontSize: 24,
    fontWeight: 300,
    fontFamily: 'IonEina, "Helvetica Neue", Helvetica, sans-serif',
    letterSpacing: 0.7,
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
    fontWeight: 300,
    fontFamily: 'IonEina, "Helvetica Neue", Helvetica, sans-serif',
    letterSpacing: 0.7,
  },
});
