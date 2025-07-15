import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import { getRandomQuote } from "@/constants/reductionConstants";
import { Picker } from "@react-native-picker/picker";
import { useAtom } from "jotai";
import {
  reductionDurationsAtom,
  selectedReductionDurationAtom,
  reductionOptionsAtom,
  reductionTargetAtom,
} from "@/atoms/reductionAtoms";
import Button from "@/components/Button";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function Reduction() {
  const router = useRouter();

  const [confirmModal, setConfirmModal] = useState(false);
  const [modalQuote, setModalQuote] = useState(""); // NEW state to hold quote

  const [durations] = useAtom(reductionDurationsAtom);
  const [selectedDurationId, setSelectedDurationId] = useAtom(
    selectedReductionDurationAtom
  );
  const [reductionOptions] = useAtom(reductionOptionsAtom);
  const [reductionTarget, setReductionTarget] = useAtom(reductionTargetAtom);

  const availableOptions = selectedDurationId
    ? reductionOptions[selectedDurationId] || []
    : [];

  // we need checkin and pledge logic

  const onCurrentModal = () => {
    router.navigate("/(tabs)/current");
    setConfirmModal(false);
  };

  const onConfirmModal = () => {
    if (selectedDurationId && reductionTarget) {
      setModalQuote(getRandomQuote()); // generate quote only on confirm
      setConfirmModal(true);
    }
  };

  const onCloseConfirmModal = () => {
    setConfirmModal(false); // Start the modal's fade-out animation
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <Text style={[styles.text, { marginTop: 30 }]}>
          Choose Alcohol Reduction Period:
        </Text>

        <View style={styles.buttonsContainer}>
          {durations.map((duration) => {
            const selected = selectedDurationId === duration;
            return (
              <TouchableOpacity
                key={duration}
                style={[
                  styles.button,
                  {
                    borderColor: selected ? "#2D9CDB" : "#ccc",
                    borderWidth: 0.5,
                    backgroundColor: selected ? "#2D9CDB33" : "transparent",
                    width: "100%",
                  },
                ]}
                onPress={() => {
                  setSelectedDurationId(duration);
                  setReductionTarget(null); // 👈 reset picker value
                }}
              >
                <View
                  style={[
                    styles.circle,
                    {
                      borderColor: selected ? "#2D9CDB" : "#ccc",
                      borderWidth: 1,
                      width: 20,
                      height: 20,
                      backgroundColor: selected ? "#2D9CDB" : "transparent",
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.label,
                    { color: selected ? "#2D9CDB" : "#333" },
                  ]}
                >
                  {duration} days
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Picker container preserved */}
        <View style={styles.pickerContainer}>
          <Text style={[styles.text, { marginTop: 30 }]}>
            Choose Amount of Alcohol Free Days:
          </Text>
          <Picker
            key={selectedDurationId} // 👈 Forces re-mount on duration change
            selectedValue={reductionTarget}
            onValueChange={(value) => setReductionTarget(value)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
            mode="dropdown"
          >
            <Picker.Item label="Select..." value={null} />
            {availableOptions.map((option) => (
              <Picker.Item
                key={option}
                label={`${option} Day${option === 1 ? "" : "s"}`}
                value={option}
              />
            ))}
          </Picker>
        </View>

        <View style={styles.btnContainer}>
          <Button label={"Confirm"} onPress={onConfirmModal} />
        </View>

        {confirmModal && (
          <Modal
            visible={confirmModal}
            transparent
            // animationType="fade"
            // onRequestClose={() => setConfirmModal(false)}
            onRequestClose={onCloseConfirmModal}
          >
            <Pressable
              style={styles.modalOverlay}
              onPress={onCloseConfirmModal}
            >
              <Pressable
                style={styles.modalContent}
                onPress={(e) => e.stopPropagation()}
              >
                <Text style={styles.text}>
                  You are committing to {reductionTarget} alcohol-free{" "}
                  {Number(reductionTarget) === 1 ? "day" : "days"} out of the
                  next {selectedDurationId} days.
                  {"\n"}
                </Text>
                <Text style={styles.text}>
                  {"\n"}
                  {modalQuote}
                </Text>

                <Button label="Commit" onPress={onCurrentModal} />
              </Pressable>
            </Pressable>
          </Modal>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "300",
    fontFamily: 'IonEina, "Helvetica Neue", Helvetica, sans-serif',
    letterSpacing: 0.7,
    textAlign: "center",
  },
  btnContainer: {
    marginTop: 60,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  pickerContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  buttonsContainer: {
    marginTop: 10,
    width: "100%",
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
  picker: {
    height: 150,
    width: 150,
  },
  pickerItem: {
    fontSize: 16,
    fontWeight: "300",
    fontFamily: 'IonEina, "Helvetica Neue", Helvetica, sans-serif',
    letterSpacing: 0.7,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
});
