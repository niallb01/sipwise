// import { View, Text, StyleSheet } from "react-native";
// import {
//   selectedReductionDurationAtom,
//   reductionTargetAtom,
// } from "@/atoms/reductionAtoms";
// import { useAtom } from "jotai";
// import { getReductionQuote } from "@/constants/reductionConstants";

// export default function Current() {
//   const [selectedDurationId] = useAtom(selectedReductionDurationAtom);
//   const [reductionTarget] = useAtom(reductionTargetAtom);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Your Current Alcohol Reduction Period:</Text>

//       <Text style={styles.text}>
//         You have committed to {reductionTarget} alcohol-free{" "}
//         {Number(reductionTarget) === 1 ? "day" : "days"} out of the next{" "}
//         {selectedDurationId} days.
//       </Text>
//       <Text style={styles.text}>{getReductionQuote()}</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   header: {
//     fontSize: 30,
//     fontWeight: 300,
//     fontFamily: 'IonEina, "Helvetica Neue", Helvetica, sans-serif',
//     letterSpacing: 0.7,
//   },
//   text: {
//     marginTop: 20,
//     fontSize: 16,
//     textAlign: "center",
//     fontWeight: 300,
//     fontFamily: 'IonEina, "Helvetica Neue", Helvetica, sans-serif',
//     letterSpacing: 0.7,
//   },
// });

// import { View, Text, StyleSheet } from "react-native";
// import { useState, useEffect } from "react";
// import { supabase } from "@/lib/supabaseClient";

// export default function Current() {
//   const [activeReduction, setActiveReduction] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchActiveReduction() {
//       setLoading(true);
//       try {
//         const { data, error } = await supabase
//           .from("reductions")
//           .select(
//             `
//               id,
//               target,
//               start_date,
//               end_date,
//               duration,
//               days_dry,
//               days_wet,
//               missed_days,
//               created_at
//             `
//           )
//           .order("created_at", { ascending: false })
//           .limit(1);

//         if (error) throw error;

//         setActiveReduction(data?.[0] || null);
//       } catch (error) {
//         console.error("Error fetching active reduction:", error);
//         setActiveReduction(null);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchActiveReduction();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.text}>Loading your reduction period...</Text>
//       </View>
//     );
//   }

//   if (!activeReduction) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.text}>No active reduction period found.</Text>
//       </View>
//     );
//   }

//   const {
//     target,
//     start_date,
//     end_date,
//     duration,
//     days_dry,
//     days_wet,
//     missed_days,
//   } = activeReduction;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>
//         Reduction period: {duration} day{duration !== 1 ? "s" : ""}
//       </Text>
//       <Text style={styles.text}>Target alcohol-free days: {target}</Text>
//       <Text style={styles.text}>
//         Start Date: {new Date(start_date).toLocaleString()}
//       </Text>
//       <Text style={styles.text}>
//         End Date: {new Date(end_date).toLocaleString()}
//       </Text>
//       <Text style={styles.text}>Days Dry: {days_dry}</Text>
//       <Text style={styles.text}>Days Wet: {days_wet}</Text>
//       <Text style={styles.text}>Missed Days: {missed_days}</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 16,
//   },
//   text: {
//     fontSize: 16,
//     textAlign: "center",
//     fontWeight: "300",
//     fontFamily: 'IonEina, "Helvetica Neue", Helvetica, sans-serif',
//     letterSpacing: 0.7,
//     marginVertical: 4,
//   },
// });

// import { View, Text, StyleSheet } from "react-native";
// import { useState, useEffect } from "react";
// import { supabase } from "@/lib/supabaseClient";

// export default function Current() {
//   const [activeReduction, setActiveReduction] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchActiveReduction() {
//       setLoading(true);
//       try {
//         const { data, error } = await supabase
//           .from("reductions")
//           .select(
//             `
//               id,
//               target,
//               start_date,
//               end_date,
//               duration,
//               days_dry,
//               days_wet,
//               missed_days,
//               created_at
//             `
//           )
//           .order("created_at", { ascending: false })
//           .limit(1);

//         if (error) throw error;

//         setActiveReduction(data?.[0] || null);
//       } catch (error) {
//         console.error("Error fetching active reduction:", error);
//         setActiveReduction(null);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchActiveReduction();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.text}>Loading your reduction period...</Text>
//       </View>
//     );
//   }

//   if (!activeReduction) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.text}>No active reduction period found.</Text>
//       </View>
//     );
//   }

//   const {
//     target,
//     start_date,
//     end_date,
//     duration,
//     days_dry,
//     days_wet,
//     missed_days,
//   } = activeReduction;

//   // Convert to readable format
//   const start = start_date ? new Date(start_date).toLocaleString() : "N/A";
//   const end = end_date ? new Date(end_date).toLocaleString() : "N/A";
//   const durationDisplay =
//     duration > 1000
//       ? `${Math.floor(duration / 1000 / 10)} days`
//       : `${duration} days`;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Reduction period: {durationDisplay}</Text>
//       <Text style={styles.text}>Target alcohol-free days: {target}</Text>
//       <Text style={styles.text}>Start Date: {start}</Text>
//       <Text style={styles.text}>End Date: {end}</Text>
//       <Text style={styles.text}>Days Dry: {days_dry}</Text>
//       <Text style={styles.text}>Days Wet: {days_wet}</Text>
//       <Text style={styles.text}>Missed Days: {missed_days}</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 16,
//   },
//   text: {
//     fontSize: 16,
//     textAlign: "center",
//     fontWeight: "300",
//     fontFamily: 'IonEina, "Helvetica Neue", Helvetica, sans-serif',
//     letterSpacing: 0.7,
//     marginVertical: 4,
//   },
// });
// import { View, Text, StyleSheet } from "react-native";
// import { useState, useEffect } from "react";
// import { supabase } from "@/lib/supabaseClient";

// export default function Current() {
//   const [activeReduction, setActiveReduction] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchActiveReduction() {
//       setLoading(true);
//       try {
//         const now = new Date().toISOString();

//         const { data, error } = await supabase
//           .from("reductions")
//           .select(
//             `
//             id,
//             target,
//             start_date,
//             end_date,
//             duration,
//             days_dry,
//             days_wet,
//             missed_days,
//             created_at
//           `
//           )
//           .gte("end_date", now) // ✅ Only include current/ongoing pledge
//           .order("created_at", { ascending: false })
//           .limit(1);

//         if (error) throw error;

//         setActiveReduction(data?.[0] || null);
//       } catch (error) {
//         console.error("Error fetching active reduction:", error);
//         setActiveReduction(null);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchActiveReduction();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.text}>Loading your reduction period...</Text>
//       </View>
//     );
//   }

//   if (!activeReduction) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.text}>No active reduction period found.</Text>
//       </View>
//     );
//   }

//   const {
//     target,
//     start_date,
//     end_date,
//     duration,
//     days_dry,
//     days_wet,
//     missed_days,
//   } = activeReduction;

//   const start = start_date ? new Date(start_date).toLocaleString() : "N/A";
//   const end = end_date ? new Date(end_date).toLocaleString() : "N/A";

//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>
//         Reduction period: {duration} day{duration !== 1 ? "s" : ""}
//       </Text>
//       <Text style={styles.text}>Target alcohol-free days: {target}</Text>
//       <Text style={styles.text}>Start Date: {start}</Text>
//       <Text style={styles.text}>End Date: {end}</Text>
//       <Text style={styles.text}>Days Dry: {days_dry}</Text>
//       <Text style={styles.text}>Days Wet: {days_wet}</Text>
//       <Text style={styles.text}>Missed Days: {missed_days}</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 16,
//   },
//   text: {
//     fontSize: 16,
//     textAlign: "center",
//     fontWeight: "300",
//     fontFamily: 'IonEina, "Helvetica Neue", Helvetica, sans-serif',
//     letterSpacing: 0.7,
//     marginVertical: 4,
//   },
// });

import { View, Text, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Current() {
  const [activeReduction, setActiveReduction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActiveReduction() {
      setLoading(true);
      try {
        const now = new Date().toISOString();

        const { data, error } = await supabase
          .from("reductions")
          .select(
            `
            id,
            target,
            start_date,
            end_date,
            duration,
            days_dry,
            days_wet,
            missed_days,
            created_at
          `
          )
          .gte("end_date", now) // Only active (not expired) pledges
          .order("created_at", { ascending: false })
          .limit(1);

        if (error) throw error;

        setActiveReduction(data?.[0] || null);
      } catch (error) {
        console.error("Error fetching active reduction:", error);
        setActiveReduction(null);
      } finally {
        setLoading(false);
      }
    }

    fetchActiveReduction();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading your reduction period...</Text>
      </View>
    );
  }

  if (!activeReduction) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No active reduction period found.</Text>
      </View>
    );
  }

  const {
    target,
    start_date,
    end_date,
    duration,
    days_dry,
    days_wet,
    missed_days,
  } = activeReduction;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Reduction period: {duration} day{duration !== 1 ? "s" : ""}
      </Text>
      <Text style={styles.text}>Target alcohol-free days: {target}</Text>
      <Text style={styles.text}>
        Start Date: {new Date(start_date).toLocaleString()}
      </Text>
      <Text style={styles.text}>
        End Date: {new Date(end_date).toLocaleString()}
      </Text>
      <Text style={styles.text}>Days Dry: {days_dry}</Text>
      <Text style={styles.text}>Days Wet: {days_wet}</Text>
      <Text style={styles.text}>Missed Days: {missed_days}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "300",
    fontFamily: 'IonEina, "Helvetica Neue", Helvetica, sans-serif',
    letterSpacing: 0.7,
    marginVertical: 4,
  },
});
