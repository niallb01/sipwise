import { View, Text, StyleSheet } from "react-native";
import {
  selectedReductionDurationAtom,
  reductionTargetAtom,
} from "@/atoms/reductionAtoms";
import { useAtom } from "jotai";
import { getReductionQuote } from "@/constants/reductionConstants";

export default function Current() {
  const [selectedDurationId, setSelectedDurationId] = useAtom(
    selectedReductionDurationAtom
  );
  const [reductionTarget, setReductionTarget] = useAtom(reductionTargetAtom);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Your Current Alcohol Reduction Period:</Text>

      <Text style={styles.text}>
        You are committing to {reductionTarget} alcohol-free{" "}
        {Number(reductionTarget) === 1 ? "day" : "days"} out of the next{" "}
        {selectedDurationId} days.
      </Text>
      <Text style={styles.text}>{getReductionQuote()}</Text>
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
    fontSize: 30,
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
