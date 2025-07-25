// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Modal,
//   Pressable,
// } from "react-native";
// import { getRandomQuote } from "@/constants/reductionConstants";
// import { Picker } from "@react-native-picker/picker";
// import { useAtom } from "jotai";
// import {
//   reductionDurationsAtom,
//   selectedReductionDurationAtom,
//   reductionOptionsAtom,
//   reductionTargetAtom,
// } from "@/atoms/reductionAtoms";
// import Button from "@/components/Button";
// import { useState } from "react";
// import { useRouter } from "expo-router";
// import { useReduction } from "@/hooks/useReduction";

// export default function Reduction() {
//   const { onStartReductionPeriod } = useReduction();

//   console.log(new Date("2025-07-17T21:01:38.714175").toLocaleString("en-GB"));
//   console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);

//   // Should print 17/07/2025, 22:01:38 BST (or local time equivalent)

//   const router = useRouter();

//   const [confirmModal, setConfirmModal] = useState(false);
//   const [modalQuote, setModalQuote] = useState(""); // NEW state to hold quote

//   const [durations] = useAtom(reductionDurationsAtom);
//   // user selected pledge period
//   const [selectedDurationId, setSelectedDurationId] = useAtom(
//     selectedReductionDurationAtom
//   );
//   // target days
//   const [reductionTarget, setReductionTarget] = useAtom(reductionTargetAtom);
//   const [reductionOptions] = useAtom(reductionOptionsAtom);

//   const onCurrentModal = () => {
//     router.navigate("/(tabs)/current");
//     setConfirmModal(false);
//   };

//   const availableOptions = selectedDurationId
//     ? reductionOptions[selectedDurationId] || []
//     : [];

//   // not pure funcs below as they change state
//   const onConfirmModal = () => {
//     if (selectedDurationId && reductionTarget) {
//       setModalQuote(getRandomQuote()); // generate quote only on confirm
//       setConfirmModal(true);
//     }
//   };

//   const onCloseConfirmModal = () => {
//     setConfirmModal(false); // Start the modal's fade-out animation
//   };

//   return (
//     <ScrollView
//       style={{ flex: 1 }}
//       keyboardShouldPersistTaps="handled"
//       showsVerticalScrollIndicator={false}
//     >
//       <View style={styles.container}>
//         <Text style={[styles.text, { marginTop: 30 }]}>
//           Choose Alcohol Reduction Period:
//         </Text>

//         <View style={styles.buttonsContainer}>
//           {durations.map((duration) => {
//             const selected = selectedDurationId === duration;
//             return (
//               <TouchableOpacity
//                 key={duration}
//                 style={[
//                   styles.button,
//                   {
//                     borderColor: selected ? "#2D9CDB" : "#ccc",
//                     borderWidth: 0.5,
//                     backgroundColor: selected ? "#2D9CDB33" : "transparent",
//                     width: "100%",
//                   },
//                 ]}
//                 onPress={() => {
//                   setSelectedDurationId(duration);
//                   setReductionTarget(null); // 👈 reset picker value
//                 }}
//               >
//                 <View
//                   style={[
//                     styles.circle,
//                     {
//                       borderColor: selected ? "#2D9CDB" : "#ccc",
//                       borderWidth: 1,
//                       width: 20,
//                       height: 20,
//                       backgroundColor: selected ? "#2D9CDB" : "transparent",
//                     },
//                   ]}
//                 />
//                 <Text
//                   style={[
//                     styles.label,
//                     { color: selected ? "#2D9CDB" : "#333" },
//                   ]}
//                 >
//                   {duration} days
//                 </Text>
//               </TouchableOpacity>
//             );
//           })}
//         </View>

//         <View style={styles.pickerContainer}>
//           <Text style={[styles.text, { marginTop: 30 }]}>
//             Choose Amount of Alcohol Free Days:
//           </Text>
//           <Picker
//             key={selectedDurationId} // 👈 Forces re-mount on duration change
//             selectedValue={reductionTarget}
//             onValueChange={(value) => setReductionTarget(value)}
//             style={styles.picker}
//             itemStyle={styles.pickerItem}
//             mode="dropdown"
//           >
//             <Picker.Item label="Select..." value={null} />
//             {availableOptions.map((option) => (
//               <Picker.Item
//                 key={option}
//                 label={`${option} Day${option === 1 ? "" : "s"}`}
//                 value={option}
//               />
//             ))}
//           </Picker>
//         </View>

//         <View style={styles.btnContainer}>
//           <Button label={"Confirm"} onPress={onConfirmModal} />
//         </View>

//         {confirmModal && (
//           <Modal
//             visible={confirmModal}
//             transparent
//             onRequestClose={onCloseConfirmModal}
//           >
//             <Pressable
//               style={styles.modalOverlay}
//               onPress={onCloseConfirmModal}
//             >
//               <Pressable
//                 style={styles.modalContent}
//                 onPress={(e) => e.stopPropagation()}
//               >
//                 <Text style={styles.text}>
//                   You are committing to {reductionTarget} alcohol-free{" "}
//                   {Number(reductionTarget) === 1 ? "day" : "days"} out of the
//                   next {selectedDurationId} days.
//                   {"\n"}
//                 </Text>
//                 <Text style={styles.text}>
//                   {"\n"}
//                   {modalQuote}
//                 </Text>
//                 <Button
//                   label="Commit"
//                   onPress={() => {
//                     onStartReductionPeriod();
//                     onCurrentModal();
//                   }}
//                 ></Button>
//               </Pressable>
//             </Pressable>
//           </Modal>
//         )}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     alignItems: "center",
//   },
//   text: {
//     fontSize: 16,
//     fontWeight: "300",
//     fontFamily: 'IonEina, "Helvetica Neue", Helvetica, sans-serif',
//     letterSpacing: 0.7,
//     textAlign: "center",
//   },
//   btnContainer: {
//     marginTop: 60,
//     paddingHorizontal: 16,
//     alignItems: "center",
//   },
//   pickerContainer: {
//     marginTop: 20,
//     alignItems: "center",
//   },
//   buttonsContainer: {
//     marginTop: 10,
//     width: "100%",
//   },
//   button: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     marginVertical: 5,
//   },
//   circle: {
//     borderRadius: 9999,
//     marginRight: 12,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: "300",
//     fontFamily: 'IonEina, "Helvetica Neue", Helvetica, sans-serif',
//     letterSpacing: 0.7,
//     textAlign: "center",
//   },
//   picker: {
//     height: 150,
//     width: 150,
//   },
//   pickerItem: {
//     fontSize: 16,
//     fontWeight: "300",
//     fontFamily: 'IonEina, "Helvetica Neue", Helvetica, sans-serif',
//     letterSpacing: 0.7,
//     textAlign: "center",
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//   },
//   modalContent: {
//     backgroundColor: "white",
//     padding: 24,
//     borderRadius: 10,
//     alignItems: "center",
//     width: "80%",
//   },
// });
/////////////////////////////

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
import { useReduction } from "@/hooks/useReduction"; // Ensure this hook is correctly imported

export default function Reduction() {
  const { onStartReductionPeriod } = useReduction();

  console.log(new Date("2025-07-17T21:01:38.714175").toLocaleString("en-GB"));
  console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);

  const router = useRouter();

  const [confirmModal, setConfirmModal] = useState(false);
  const [modalQuote, setModalQuote] = useState("");

  const [durations] = useAtom(reductionDurationsAtom);
  const [selectedDurationId, setSelectedDurationId] = useAtom(
    selectedReductionDurationAtom
  );
  const [reductionTarget, setReductionTarget] = useAtom(reductionTargetAtom);
  const [reductionOptions] = useAtom(reductionOptionsAtom);

  const onCurrentModal = () => {
    router.navigate("/(tabs)/current");
    setConfirmModal(false);
  };

  const availableOptions = selectedDurationId
    ? reductionOptions[selectedDurationId] || []
    : [];

  const onConfirmModal = () => {
    if (selectedDurationId && reductionTarget) {
      setModalQuote(getRandomQuote());
      setConfirmModal(true);
    }
  };

  const onCloseConfirmModal = () => {
    setConfirmModal(false);
  };

  // --- CORRECTED ASYNC HANDLER FOR THE COMMIT BUTTON ---
  const handleCommitAndNavigate = async () => {
    // The onConfirmModal already ensures selectedDurationId and reductionTarget are set.
    try {
      // Call without arguments, as onStartReductionPeriod reads them directly from Jotai atoms.
      console.log("Attempting to start reduction period and navigate...");
      await onStartReductionPeriod();
      console.log("Reduction period started, navigating to current tab.");
      onCurrentModal(); // Navigate ONLY AFTER the database operation is complete
    } catch (error) {
      console.error("Error starting reduction period:", error);
      // Optionally show an error message to the user
    }
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
                  setReductionTarget(null);
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

        <View style={styles.pickerContainer}>
          <Text style={[styles.text, { marginTop: 30 }]}>
            Choose Amount of Alcohol Free Days:
          </Text>
          <Picker
            key={selectedDurationId}
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
                <Button
                  label="Commit"
                  // Call the new async handler here
                  onPress={handleCommitAndNavigate}
                ></Button>
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
