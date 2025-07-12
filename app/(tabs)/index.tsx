import { Text, View, StyleSheet } from "react-native";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";

export default function HomeScreen() {
  const router = useRouter();

  const onReductionModal = () => {
    router.navigate("/(modals)/reduction");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>SipSmart</Text>
      <Text style={styles.text}>
        Your Alcohol Reduction Journey Starts Here
      </Text>
      <Button label="Start" onPress={onReductionModal} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
