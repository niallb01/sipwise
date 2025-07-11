import { Text, View, StyleSheet } from "react-native";

export default function Stats() {
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.header}>Stats</Text>
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
  header: {
    fontSize: 25,
    fontWeight: 300,
    fontFamily: 'IonEina, "Helvetica Neue", Helvetica, sans-serif',
    letterSpacing: 0.7,
  },
  pledgeText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
    fontWeight: 300,
    fontFamily: 'IonEina, "Helvetica Neue", Helvetica, sans-serif',
    letterSpacing: 0.7,
  },
  question: {
    marginBottom: 15,
    marginTop: 20,
    fontSize: 20,
    textAlign: "center",
    fontWeight: 300,
    fontFamily: 'IonEina, "Helvetica Neue", Helvetica, sans-serif',
    letterSpacing: 0.7,
  },
});
