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
//   const [loadingReduction, setLoadingReduction] = useState(true);
//   const [reductionFetchError, setReductionFetchError] = useState<string | null>(
//     null
//   );

//   const {
//     hasCheckedInToday,
//     onCheckIn,
//     loading: checkInLoading,
//     error: checkInError,
//   } = userCheckIn(activeReduction);

//   const fetchActiveReduction = async () => {
//     setLoadingReduction(true);
//     setReductionFetchError(null);

//     try {
//       const { data: userData, error: userError } =
//         await supabase.auth.getUser();
//       const user = userData?.user;

//       if (userError || !user) {
//         console.error(
//           "No user logged in or error fetching user:",
//           userError?.message || "User not found."
//         );
//         setReductionFetchError("Please log in to view your active pledge.");
//         setLoadingReduction(false);
//         return;
//       }

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
//         .eq("user_id", user.id)
//         .eq("status", "active")
//         .order("start_date", { ascending: false })
//         .limit(1);

//       if (error) throw error;

//       setActiveReduction(data?.[0] || null);
//     } catch (error: any) {
//       console.error("Error fetching active reduction:", error.message);
//       setReductionFetchError(`Failed to load pledge: ${error.message}`);
//       setActiveReduction(null);
//     } finally {
//       setLoadingReduction(false);
//     }
//   };

//   useEffect(() => {
//     fetchActiveReduction();
//   }, []);

//   if (loadingReduction) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.text}>Loading your reduction period...</Text>
//       </View>
//     );
//   }

//   if (reductionFetchError) {
//     return (
//       <View style={styles.container}>
//         <Text style={[styles.text, { color: "red" }]}>
//           {reductionFetchError}
//         </Text>
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
//         Reduction Period: {duration} day{duration !== 1 ? "s" : ""}
//       </Text>
//       <Text style={styles.text}>Target Alcohol-Free Days: {target}</Text>
//       <Text style={styles.text}>
//         Start Date: {formatDateToLocalWithTZ(start_date)}
//       </Text>
//       <Text style={styles.text}>
//         End Date: {formatDateToLocalWithTZ(end_date)}
//       </Text>

//       <Text style={styles.text}>Days Dry: {days_dry}</Text>
//       <Text style={styles.text}>Days Wet: {days_wet}</Text>
//       <Text style={styles.text}>Missed Days: {missed_days}</Text>

//       {checkInError && (
//         <Text style={[styles.text, { color: "red", marginTop: 10 }]}>
//           Error checking in: {checkInError}
//         </Text>
//       )}

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

import React, { useState, useEffect, useCallback, useMemo } from "react"; // Added useMemo
import { View, Text, StyleSheet } from "react-native";
import { supabase } from "@/lib/supabaseClient";
import { ReductionPeriod } from "@/types/reductionTypes";
import {
  formatDateToLocalWithTZ,
  getVirtualDayInfo,
} from "@/utils/dateHelpers"; // Ensure getVirtualDayInfo is imported
import Button from "@/components/Button"; // Assuming this is your custom Button component
import { userCheckIn } from "@/hooks/userCheckIn";

export default function Current() {
  const [activeReduction, setActiveReduction] =
    useState<ReductionPeriod | null>(null);
  const [loadingReduction, setLoadingReduction] = useState(true);
  const [reductionFetchError, setReductionFetchError] = useState<string | null>(
    null
  );

  // MODIFIED: Destructure `status` from userCheckIn hook
  const {
    status, // This is the new comprehensive status object
    onCheckIn,
    loading: checkInLoading,
    error: checkInError,
  } = userCheckIn(activeReduction);

  // Memoized fetch function to use in useEffect and after check-in
  const fetchActiveReduction = useCallback(async () => {
    setLoadingReduction(true);
    setReductionFetchError(null);

    try {
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
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("start_date", { ascending: false })
        .limit(1);

      if (error) throw error;

      setActiveReduction(data?.[0] || null);
    } catch (error: any) {
      console.error("Error fetching active reduction:", error.message);
      setReductionFetchError(`Failed to load pledge: ${error.message}`);
      setActiveReduction(null);
    } finally {
      setLoadingReduction(false);
    }
  }, []); // useCallback with empty deps means it's stable

  // Handler to call onCheckIn and then refresh the main reduction data
  const handleCheckInAndRefresh = async (
    type: "dry" | "wet",
    targetDay: number
  ) => {
    await onCheckIn(type, targetDay);
    // After the check-in attempt (success or failure), refetch to update UI counts
    fetchActiveReduction();
  };

  useEffect(() => {
    fetchActiveReduction();
  }, [fetchActiveReduction]); // Dependency on the memoized fetch function

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
      {/* Display Current Virtual Day (for testing) */}
      <Text style={styles.text}>
        Current Virtual Day:{" "}
        {status.currentVirtualDay !== -1
          ? status.currentVirtualDay
          : "Loading..."}
      </Text>

      <Text style={styles.text}>
        Reduction Period: {duration} day{duration !== 1 ? "s" : ""}
      </Text>
      <Text style={styles.text}>Target Alcohol-Free Days: {target}</Text>
      <Text style={styles.text}>
        Start Date: {formatDateToLocalWithTZ(start_date)}
      </Text>
      <Text style={styles.text}>
        End Date: {formatDateToLocalWithTZ(end_date)}
      </Text>

      <Text style={styles.text}>Days Dry: {days_dry}</Text>
      <Text style={styles.text}>Days Wet: {days_wet}</Text>
      <Text style={styles.text}>Missed Days: {missed_days}</Text>

      {checkInError && (
        <Text style={[styles.text, { color: "red", marginTop: 10 }]}>
          Error checking in: {checkInError}
        </Text>
      )}

      {/* Conditional Buttons based on `status` from the hook */}
      {!status.pledgeActive ? (
        <Text style={styles.text}>Start a new pledge to check in.</Text>
      ) : (
        <>
          {/* Check-in for TODAY's virtual day */}
          {status.canCheckInToday ? (
            <View>
              <Text style={styles.text}>
                Check in for Virtual Day {status.currentVirtualDay}:
              </Text>
              <Button
                label="No Alcohol (Dry) - Today"
                onPress={() =>
                  handleCheckInAndRefresh("dry", status.currentVirtualDay)
                }
                // disabled={checkInLoading}
              />
              <Button
                label="Alcohol (Wet) - Today"
                onPress={() =>
                  handleCheckInAndRefresh("wet", status.currentVirtualDay)
                }
                // disabled={checkInLoading}
              />
            </View>
          ) : (
            status.currentVirtualDay !== -1 && (
              <Text style={styles.text}>
                ✅ Checked in for Virtual Day {status.currentVirtualDay}
              </Text>
            )
          )}

          {/* Check-in for YESTERDAY's virtual day (if within grace period) */}
          {status.canCheckInYesterday ? (
            <View style={{ marginTop: 15 }}>
              <Text style={styles.text}>
                Check in for Virtual Day {status.yesterdayVirtualDay} (Grace
                Period):
              </Text>
              <Button
                label="No Alcohol (Dry) - Yesterday"
                onPress={() =>
                  handleCheckInAndRefresh("dry", status.yesterdayVirtualDay)
                }
                // disabled={checkInLoading}
              />
              <Button
                label="Alcohol (Wet) - Yesterday"
                onPress={() =>
                  handleCheckInAndRefresh("wet", status.yesterdayVirtualDay)
                }
                // disabled={checkInLoading}
              />
            </View>
          ) : (
            // Only show this message if yesterday was a valid day AND it's already checked in
            status.yesterdayVirtualDay >= 0 && (
              <Text style={styles.text}>
                ✅ Checked in for Virtual Day {status.yesterdayVirtualDay}
              </Text>
            )
          )}
        </>
      )}
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
