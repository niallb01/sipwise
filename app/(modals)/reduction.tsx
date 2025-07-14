import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
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

export default function Reduction() {
  const [confirmModal, setConfirmModal] = useState(false);
  const [durations] = useAtom(reductionDurationsAtom);
  const [selectedDurationId, setSelectedDurationId] = useAtom(
    selectedReductionDurationAtom
  );
  const [reductionOptions] = useAtom(reductionOptionsAtom);
  const [reductionTarget, setReductionTarget] = useAtom(reductionTargetAtom);

  const availableOptions = selectedDurationId
    ? reductionOptions[selectedDurationId] || []
    : [];

  const onConfirmModal = () => {
    console.log("confirm");
    setConfirmModal(true);
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
                onPress={() => setSelectedDurationId(duration)}
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
            style={styles.picker}
            itemStyle={styles.pickerItem}
            mode="dropdown"
            selectedValue={reductionTarget}
            onValueChange={(value) => setReductionTarget(value)}
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

        <View style={styles.loremContainer}>
          <Button label={"Confirm"} onPress={onConfirmModal} />
        </View>
        {/* <Modal
          visible={confirmModal}
          transparent
          animationType="fade"
          onRequestClose={() => setConfirmModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                Your reduction plan has been set!
              </Text>
              <Pressable
                style={styles.overlay}
                onPress={() => setConfirmModal(false)}
              ></Pressable>
              <Pressable
                style={styles.modalContent}
                onPress={(e) => e.stopPropagation()} // prevent close on inner press
              ></Pressable>

              <Button label={"Commit"} onPress={() => setConfirmModal(false)} />
            </View>
          </View>
        </Modal> */}

        <Modal
          visible={confirmModal}
          transparent
          animationType="fade"
          onRequestClose={() => setConfirmModal(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setConfirmModal(false)} // closes on outside press
          >
            <Pressable
              style={styles.modalContent}
              onPress={(e) => e.stopPropagation()} // prevents close on content tap
            >
              <Text style={styles.modalText}>
                Your reduction plan has been set!
              </Text>
              <Button label="Commit" onPress={() => setConfirmModal(false)} />
            </Pressable>
          </Pressable>
        </Modal>
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
  loremContainer: {
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
  modalText: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#2D9CDB",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "600",
  },
});
