// import { radioButtons } from "@/components/RadioButtons";
// import { useState } from "react";
// import { View, StyleSheet, Text } from "react-native";
// import RadioGroup from "react-native-radio-buttons-group"; // FIXED HERE

// export default function ReductionOptions() {
//   const [selectedId, setSelectedId] = useState<string | undefined>();

//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Choose Alcohol Reduction Period:</Text>
//       <RadioGroup
//         radioButtons={radioButtons}
//         onPress={setSelectedId}
//         selectedId={selectedId}
//         layout="row"
//         containerStyle={styles.groupContainer}
//         labelStyle={styles.label}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     alignItems: "center",
//   },
//   text: {
//     marginTop: 20,
//     fontSize: 16,
//     textAlign: "center",
//     fontWeight: "300",
//     fontFamily: 'IonEina, "Helvetica Neue", Helvetica, sans-serif',
//     letterSpacing: 0.7,
//   },
//   groupContainer: {
//     marginTop: 15,
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "flex-start",
//     rowGap: 10,
//     columnGap: 10,
//     paddingHorizontal: 10,
//   },
//   label: {
//     fontSize: 16,
//     marginLeft: 8,
//     marginRight: 12,
//     textAlign: "center",
//     fontWeight: "300",
//     fontFamily: 'IonEina, "Helvetica Neue", Helvetica, sans-serif',
//     letterSpacing: 0.7,
//   },
// });

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { radioButtons } from "@/components/RadioButtons";

export default function ReductionOptions() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const screenWidth = Dimensions.get("window").width;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Choose Alcohol Reduction Period:</Text>
      <View style={styles.buttonsContainer}>
        {radioButtons.map(
          ({ id, label, size, color, borderColor, borderSize }) => {
            const selected = selectedId === id;
            return (
              <TouchableOpacity
                key={id}
                style={[
                  styles.button,
                  {
                    borderColor: selected ? color : borderColor,
                    borderWidth: borderSize,
                    backgroundColor: selected ? color + "33" : "transparent",
                    width: screenWidth - 32, // full width minus padding
                  },
                ]}
                onPress={() => setSelectedId(id)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.circle,
                    {
                      borderColor: selected ? color : borderColor,
                      borderWidth: borderSize,
                      width: size,
                      height: size,
                      backgroundColor: selected ? color : "transparent",
                    },
                  ]}
                />
                <Text
                  style={[styles.label, { color: selected ? color : "#333" }]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          }
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "300",
    fontFamily: 'IonEina, "Helvetica Neue", Helvetica, sans-serif',
    letterSpacing: 0.7,
    textAlign: "center",
  },
  buttonsContainer: {
    marginTop: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginVertical: 5,
  },
  circle: {
    borderRadius: 9999,
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "300",
  },
});
