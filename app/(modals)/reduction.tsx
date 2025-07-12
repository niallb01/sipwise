import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Button from "@/components/Button";
import { MS_PER_SIMULATED_DAY } from "@/constants/reductionConstants";
import { Picker } from "@react-native-picker/picker";
import { useAtom } from "jotai";
import {
  completedReductionAtom,
  activeReductionAtom,
  allCheckInsAtom,
  reductionDurationsAtom,
  reductionOptionsAtom,
  reductionTargetAtom,
} from "@/atoms/reductionAtoms";

export default function Reduction() {
  const [durations] = useAtom(reductionDurationsAtom);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Choose Alcohol Reduction Period:</Text>
      <View style={styles.buttonContainer}>
        {durations.map((duration) => (
          <TouchableOpacity
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 30,
              backgroundColor: "#0071e3",
            }}
            key={duration}
            onPress={() => console.log(duration)}
          >
            <Text style={styles.btnText}>{`${duration} Days`}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 40,
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
    fontWeight: "300",
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
    width: 250,
  },
  btnText: {
    color: "#fff",
    fontWeight: 300,
    fontFamily: 'IonEina, "Helvetica Neue", Helvetica, sans-serif',
    letterSpacing: 0.7,
  },
});
