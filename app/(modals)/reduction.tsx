import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { radioButtons } from "@/components/RadioButtons";

export default function Reduction() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

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
                    width: "100%", // full width of container
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
    marginTop: 30,
    fontSize: 16,
    fontWeight: "300",
    fontFamily: 'IonEina, "Helvetica Neue", Helvetica, sans-serif',
    letterSpacing: 0.7,
    textAlign: "center",
  },
  buttonsContainer: {
    marginTop: 10,
    width: "100%", // make container full width for buttons to fill
    maxWidth: 400, // optional max width, adjust as needed
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
    fontFamily: 'IonEina, "Helvetica Neue", Helvetica, sans-serif',
    letterSpacing: 0.7,
    textAlign: "center",
  },
});
