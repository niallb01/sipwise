// import { View, Text, StyleSheet } from "react-native";
// import { useState, useEffect } from "react";
// import { supabase } from "@/lib/supabaseClient";
// import { ReductionPeriod } from "@/types/reductionTypes";
// import { formatDateToLocalWithTZ } from "@/utils/dateHelpers";
// import Button from "@/components/Button";
// import { userCheckIn } from "@/hooks/userCheckIn";

// export default function Current() {
//   const [activeReduction, setActiveReduction] =
//     useState<ReductionPeriod | null>(null);
//   // const [hasCheckedInToday] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // const { onCheckIn } = userCheckIn();
//   const {
//     hasCheckedInToday,
//     onCheckIn,
//     loading: checkInLoading,
//     error: checkInError,
//   } = userCheckIn(activeReduction);

//   const fetchActiveReduction = async () => {
//     setLoading(true);
//     try {
//       const { data, error } = await supabase
//         .from("reductions")
//         .select(
//           `
//           id,
//           target,
//           start_date,
//           end_date,
//           duration,
//           days_dry,
//           days_wet,
//           missed_days
//         `
//         )
//         .eq("status", "active")
//         .order("start_date", { ascending: false })
//         .limit(1);

//       if (error) throw error;

//       setActiveReduction(data?.[0] || null);
//     } catch (error) {
//       console.error("Error fetching active reduction:", error);
//       setActiveReduction(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchActiveReduction();
//   }, []);

//   //////////////////////////////////////////////////////
//   /////checkin
//   //////////////////////////////////////

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
//         Start Date: {formatDateToLocalWithTZ(start_date)}
//       </Text>
//       <Text style={styles.text}>
//         End Date: {formatDateToLocalWithTZ(end_date)}
//       </Text>

//       <Text style={styles.text}>Days Dry: {days_dry}</Text>
//       <Text style={styles.text}>Days Wet: {days_wet}</Text>
//       <Text style={styles.text}>Missed Days: {missed_days}</Text>

//       {hasCheckedInToday ? (
//         <Text style={styles.text}>✅ You’ve already checked in today!</Text>
//       ) : (
//         <>
//           <Button label="No (Dry)" onPress={() => onCheckIn("dry")} />
//           <Button label="Yes (Wet)" onPress={() => onCheckIn("wet")} />
//         </>
//       )}
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
import { ReductionPeriod } from "@/types/reductionTypes";
import { formatDateToLocalWithTZ } from "@/utils/dateHelpers";
import Button from "@/components/Button";
import { userCheckIn } from "@/hooks/userCheckIn";

export default function Current() {
  const [activeReduction, setActiveReduction] =
    useState<ReductionPeriod | null>(null);
  const [loadingReduction, setLoadingReduction] = useState(true); // Renamed for clarity
  const [reductionFetchError, setReductionFetchError] = useState<string | null>(
    null
  ); // New state for fetch errors

  // Destructure values from your custom hook
  const {
    hasCheckedInToday,
    onCheckIn,
    loading: checkInLoading,
    error: checkInError, // This will catch errors from the RPC call
  } = userCheckIn(activeReduction);

  // --- Function to fetch the active reduction period for the current user ---
  const fetchActiveReduction = async () => {
    setLoadingReduction(true); // Start loading
    setReductionFetchError(null); // Clear any previous fetch errors

    try {
      // Get the current authenticated user
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      const user = userData?.user;

      if (userError || !user) {
        console.error(
          "No user logged in or error fetching user:",
          userError?.message || "User not found."
        );
        setReductionFetchError("Please log in to view your active pledge.");
        setLoadingReduction(false);
        return;
      }

      // Fetch the active reduction for THIS user
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
          missed_days
        `
        )
        .eq("user_id", user.id) // <-- CRITICAL: Filter by the current user's ID
        .eq("status", "active") // Filter by 'active' status
        .order("start_date", { ascending: false }) // Get the most recent active one if multiple
        .limit(1); // Assuming only one active reduction per user

      if (error) throw error;

      setActiveReduction(data?.[0] || null); // Set the active reduction or null if none found
    } catch (error: any) {
      console.error("Error fetching active reduction:", error.message);
      setReductionFetchError(`Failed to load pledge: ${error.message}`);
      setActiveReduction(null);
    } finally {
      setLoadingReduction(false); // End loading
    }
  };

  // Fetch the active reduction when the component mounts
  useEffect(() => {
    fetchActiveReduction();
    // Re-fetch if user session changes, though auth.getUser() handles much of it.
    // For simplicity, we'll keep it as an empty dependency array for now,
    // assuming user session changes trigger a re-mount or a refresh elsewhere.
  }, []);

  // --- Render Logic ---

  if (loadingReduction) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading your reduction period...</Text>
      </View>
    );
  }

  if (reductionFetchError) {
    return (
      <View style={styles.container}>
        <Text style={[styles.text, { color: "red" }]}>
          {reductionFetchError}
        </Text>
        {/* Potentially add a "Retry" button here */}
      </View>
    );
  }

  if (!activeReduction) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No active reduction period found.</Text>
        {/* You could add a button here to navigate to a "Create New Pledge" screen */}
      </View>
    );
  }

  // Destructure properties from the activeReduction for easier use in JSX
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
      <Text style={styles.title}>Your Current Pledge</Text>

      <Text style={styles.text}>
        Reduction period: **{duration} day{duration !== 1 ? "s" : ""}**
      </Text>
      <Text style={styles.text}>Target alcohol-free days: **{target}**</Text>
      <Text style={styles.text}>
        Start Date: **{formatDateToLocalWithTZ(start_date)}**
      </Text>
      <Text style={styles.text}>
        End Date: **{formatDateToLocalWithTZ(end_date)}**
      </Text>

      {/* Display current progress */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Dry Days: **{days_dry}**</Text>
        <Text style={styles.progressText}>Wet Days: **{days_wet}**</Text>
        <Text style={styles.progressText}>Missed Days: **{missed_days}**</Text>
      </View>

      {/* Display check-in status and buttons */}
      {checkInError && (
        <Text style={[styles.text, { color: "red", marginTop: 10 }]}>
          Error checking in: {checkInError}
        </Text>
      )}

      {hasCheckedInToday ? (
        <Text style={styles.checkedInText}>
          ✅ You’ve already checked in today!
        </Text>
      ) : (
        <View style={styles.buttonContainer}>
          <Text style={styles.checkInPrompt}>How was your day?</Text>
          <Button
            label={checkInLoading ? "Checking In..." : "No Alcohol (Dry)"}
            onPress={() => onCheckIn("dry")}
            // disabled={checkInLoading}
            style={styles.dryButton}
          />
          <Button
            label={checkInLoading ? "Checking In..." : "Alcohol Consumed (Wet)"}
            onPress={() => onCheckIn("wet")}
            // disabled={checkInLoading}
            style={styles.wetButton}
          />
        </View>
      )}
    </View>
  );
}

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20, // Increased padding for better spacing
    backgroundColor: "#f8f8f8", // Light background for contrast
  },
  title: {
    fontSize: 26, // Larger title
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    fontFamily: 'IonEina, "Helvetica Neue", Helvetica, sans-serif',
    letterSpacing: 1,
  },
  text: {
    fontSize: 18, // Slightly larger text
    textAlign: "center",
    fontWeight: "300",
    fontFamily: 'IonEina, "Helvetica Neue", Helvetica, sans-serif',
    letterSpacing: 0.7,
    marginVertical: 5, // Increased vertical margin
    color: "#555",
  },
  progressContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#e0f7fa", // Light blue background for progress
    width: "90%", // Wider container
    alignItems: "center",
    shadowColor: "#000", // Add subtle shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3, // For Android
  },
  progressText: {
    fontSize: 20, // Larger progress text
    fontWeight: "600",
    marginVertical: 3,
    color: "#00796b", // Darker green for progress text
    fontFamily: 'IonEina, "Helvetica Neue", Helvetica, sans-serif',
  },
  checkedInText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50", // Green for success
    marginTop: 20,
    textAlign: "center",
    fontFamily: 'IonEina, "Helvetica Neue", Helvetica, sans-serif',
  },
  buttonContainer: {
    marginTop: 30, // More space above buttons
    width: "80%", // Control button width
  },
  checkInPrompt: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
    fontFamily: 'IonEina, "Helvetica Neue", Helvetica, sans-serif',
  },
  dryButton: {
    backgroundColor: "#8BC34A", // Green for 'Dry'
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  wetButton: {
    backgroundColor: "#FF7043", // Orange for 'Wet'
    paddingVertical: 15,
    borderRadius: 8,
  },
});
