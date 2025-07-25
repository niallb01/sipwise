// import { useState, useEffect, useCallback } from "react"; // Import useCallback
// import { supabase } from "@/lib/supabaseClient";
// import { MS_PER_SIMULATED_DAY } from "@/constants/reductionConstants";
// import { ReductionPeriod } from "@/types/reductionTypes";

// export function userCheckIn(activeReduction: ReductionPeriod | null) {
//   const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Perform check-in using the Supabase RPC function
//   async function onCheckIn(status: "dry" | "wet") {
//     if (!activeReduction || hasCheckedInToday) {
//       console.warn(
//         "Check-in prevented: No active reduction or already checked in today."
//       );
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const { data: userData } = await supabase.auth.getUser();
//       const user = userData?.user;
//       if (!user) {
//         throw new Error("No user logged in. Please log in to check in.");
//       }

//       const { error: rpcError } = await supabase.rpc("handle_user_check_in", {
//         p_user_id: user.id,
//         p_reduction_id: activeReduction.id,
//         p_status: status,
//       });

//       if (rpcError) {
//         throw rpcError;
//       }
//     } catch (err: any) {
//       console.error("Check-in error:", err.message);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//     console.log(status);
//   }

//   return { hasCheckedInToday, onCheckIn, loading, error };
// }
/////////////////////////////////////////////////////

// import { useState, useEffect, useCallback } from "react";
// import { supabase } from "@/lib/supabaseClient";
// import { MS_PER_SIMULATED_DAY } from "@/constants/reductionConstants"; // Make sure this is correctly defined and imported
// import { ReductionPeriod } from "@/types/reductionTypes";

// // Utility function to get virtual day info (ensure this is available or defined here)
// // If you have this in a separate utils/date.ts file, just import it.
// // Otherwise, you might need to place this function somewhere accessible.
// const getVirtualDayInfo = (startDate: Date) => {
//   const now = new Date();
//   const timeElapsed = now.getTime() - startDate.getTime(); // Time in milliseconds since start_date
//   const currentVirtualDay = Math.floor(timeElapsed / MS_PER_SIMULATED_DAY);
//   return { currentVirtualDay };
// };

// export function userCheckIn(activeReduction: ReductionPeriod | null) {
//   // `hasCheckedInToday` and `loading` can remain, but their logic might be simplified by the UI/RPC
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // This `hasCheckedInToday` state should ideally be managed by your UI component
//   // which checks `status.canCheckInToday` and `status.canCheckInYesterday` from a `useCurrentStatus` hook
//   // to determine button visibility. The RPC/DB handles the actual duplicate prevention.
//   // For now, let's remove the direct check here to allow the RPC to handle it.
//   // const [hasCheckedInToday, setHasCheckedInToday] = useState(false);

//   // MODIFIED: onCheckIn now accepts `targetVirtualDay`
//   const onCheckIn = useCallback(
//     async (statusType: "dry" | "wet", targetVirtualDay: number) => {
//       if (!activeReduction || !activeReduction.start_date) {
//         setError("No active reduction period to check into.");
//         return;
//       }

//       setLoading(true);
//       setError(null);

//       try {
//         const { data: userData } = await supabase.auth.getUser();
//         const user = userData?.user;
//         if (!user) {
//           throw new Error("No user logged in. Please log in to check in.");
//         }

//         // Calculate the current virtual day at the time of the check-in action
//         const startDate = new Date(activeReduction.start_date);
//         const { currentVirtualDay } = getVirtualDayInfo(startDate); // This needs to be correctly imported or defined

//         console.log(`Attempting check-in for virtual day: ${targetVirtualDay}`);
//         console.log(`Current virtual day is: ${currentVirtualDay}`);
//         console.log(`Status: ${statusType}`);

//         // Call the Supabase RPC function with all 5 parameters
//         const { data: rpcResponse, error: rpcError } = await supabase.rpc(
//           "handle_user_check_in",
//           {
//             p_user_id: user.id, // Parameter 1
//             p_reduction_id: activeReduction.id, // Parameter 2
//             p_status: statusType, // Parameter 3
//             p_target_virtual_day_number: targetVirtualDay, // Parameter 4
//             p_current_virtual_day_number: currentVirtualDay, // Parameter 5
//           }
//         );

//         if (rpcError) {
//           console.error("Check-in error:", rpcError.message);
//           setError(rpcError.message); // Set error state from RPC response
//           // Consider handling specific error codes for UI feedback if needed
//           return; // Exit on error
//         }

//         console.log("Check-in successful:", rpcResponse);
//         // setHasCheckedInToday(true); // You might manage this through a refresh of data or a toast
//         // Instead of direct state, you'll likely want to re-fetch check-in status
//         // or trigger a global update in your UI after a successful check-in.
//         setError(null); // Clear any previous errors on success
//       } catch (err: any) {
//         console.error("Unexpected Check-in error:", err.message);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [activeReduction]
//   ); // Add activeReduction to useCallback dependencies

//   // If you are relying on `hasCheckedInToday` for UI, you'll need to re-evaluate it
//   // based on actual check-in data after the RPC call, perhaps by having a state/effect
//   // that queries check_ins for the current virtual day.
//   // For the purpose of fixing the RPC call, we'll focus on `onCheckIn`'s signature.
//   const hasCheckedInToday = false; // Placeholder, as its logic is tied to Current.tsx's status

//   return { hasCheckedInToday, onCheckIn, loading, error };
// }
//////////////////////////////

// hooks/userCheckIn.ts (Complete, updated version)
// import { useState, useEffect, useCallback, useMemo } from "react"; // Added useMemo
// import { supabase } from "@/lib/supabaseClient";
// import { ReductionPeriod } from "@/types/reductionTypes";
// // Ensure these are correctly imported from your utils/dateHelpers.ts
// import {
//   getVirtualDayInfo,
//   getVirtualDateFromDayNumber,
// } from "@/utils/dateHelpers";
// // Ensure this constant is correctly defined in constants/reductionConstants.ts
// // export const MS_PER_SIMULATED_DAY = 10 * 1000; // 10 seconds (if not already in a constants file)

// interface CheckInStatus {
//   canCheckInToday: boolean;
//   canCheckInYesterday: boolean;
//   todayCheckedIn: boolean;
//   yesterdayCheckedIn: boolean;
//   currentVirtualDay: number;
//   yesterdayVirtualDay: number;
//   pledgeActive: boolean;
// }

// export function userCheckIn(activeReduction: ReductionPeriod | null) {
//   const [status, setStatus] = useState<CheckInStatus>({
//     canCheckInToday: false,
//     canCheckInYesterday: false,
//     todayCheckedIn: false,
//     yesterdayCheckedIn: false,
//     currentVirtualDay: -1,
//     yesterdayVirtualDay: -1,
//     pledgeActive: false,
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Memoized function to check check-in status for specific virtual days
//   const checkVirtualDayStatus = useCallback(async () => {
//     if (!activeReduction || !activeReduction.start_date) {
//       setStatus((prev) => ({ ...prev, pledgeActive: false }));
//       return;
//     }

//     // Set loading only for the check-in action, not for status updates
//     // setLoading(true); // Don't set loading here to avoid flickering
//     setError(null);

//     try {
//       const startDate = new Date(activeReduction.start_date);
//       const { currentVirtualDay } = getVirtualDayInfo(startDate);
//       const yesterdayVirtualDay =
//         currentVirtualDay > 0 ? currentVirtualDay - 1 : -1;

//       const todayVirtualDateString =
//         getVirtualDateFromDayNumber(currentVirtualDay);
//       const yesterdayVirtualDateString =
//         yesterdayVirtualDay >= 0
//           ? getVirtualDateFromDayNumber(yesterdayVirtualDay)
//           : null;

//       // Fetch check-ins for current and previous day
//       const { data: checkIns, error: fetchError } = await supabase
//         .from("check_ins")
//         .select("check_in_date")
//         .eq("reduction_id", activeReduction.id)
//         .in(
//           "check_in_date",
//           [todayVirtualDateString, yesterdayVirtualDateString].filter(Boolean)
//         ); // Filter out null

//       if (fetchError) {
//         throw fetchError;
//       }

//       const todayCheckedIn = checkIns.some(
//         (ci) =>
//           getVirtualDateFromDayNumber(currentVirtualDay) === ci.check_in_date
//       );
//       const yesterdayCheckedIn =
//         yesterdayVirtualDay >= 0 &&
//         checkIns.some(
//           (ci) =>
//             getVirtualDateFromDayNumber(yesterdayVirtualDay) ===
//             ci.check_in_date
//         );

//       setStatus({
//         canCheckInToday: !todayCheckedIn, // Can check in if not already done
//         canCheckInYesterday: yesterdayVirtualDay >= 0 && !yesterdayCheckedIn, // Can check yesterday if valid day and not done
//         todayCheckedIn,
//         yesterdayCheckedIn,
//         currentVirtualDay,
//         yesterdayVirtualDay,
//         pledgeActive: true,
//       });
//     } catch (err: any) {
//       console.error("Error checking check-in status (virtual):", err.message);
//       setError("Failed to check daily status.");
//       setStatus((prev) => ({
//         ...prev,
//         pledgeActive: true,
//         canCheckInToday: false,
//         canCheckInYesterday: false,
//       }));
//     } finally {
//       // setLoading(false); // Don't set loading here
//     }
//   }, [activeReduction]);

//   // Effect to run the check and set up the interval for virtual days
//   useEffect(() => {
//     checkVirtualDayStatus(); // Initial check

//     const interval = setInterval(() => {
//       checkVirtualDayStatus();
//     }, 1000); // Check every second for rapid virtual day changes

//     return () => clearInterval(interval); // Cleanup interval
//   }, [checkVirtualDayStatus]);

//   // Perform check-in using the Supabase RPC function for virtual days
//   const onCheckIn = useCallback(
//     async (statusType: "dry" | "wet", targetVirtualDay: number) => {
//       if (!activeReduction || !activeReduction.start_date) {
//         setError("No active reduction period to check into.");
//         return;
//       }

//       setLoading(true); // Set loading for the check-in action
//       setError(null);

//       try {
//         const { data: userData } = await supabase.auth.getUser();
//         const user = userData?.user;
//         if (!user) {
//           throw new Error("No user logged in. Please log in to check in.");
//         }

//         const startDate = new Date(activeReduction.start_date);
//         const { currentVirtualDay } = getVirtualDayInfo(startDate); // Get current virtual day when action is taken

//         // Call the Supabase RPC function, passing the target and current virtual day numbers
//         const { data: rpcResponse, error: rpcError } = await supabase.rpc(
//           "handle_user_check_in",
//           {
//             p_user_id: user.id,
//             p_reduction_id: activeReduction.id,
//             p_status: statusType,
//             p_target_virtual_day_number: targetVirtualDay, // The day we're logging for
//             p_current_virtual_day_number: currentVirtualDay, // The current day number
//           }
//         );

//         if (rpcError) {
//           console.error("RPC Error:", rpcError.message);
//           if (
//             rpcError.code === "23505" ||
//             rpcError.message.includes("already checked in")
//           ) {
//             setError(
//               `You've already checked in for virtual day ${targetVirtualDay}.`
//             );
//           } else if (rpcError.message.includes("Grace period expired")) {
//             setError(rpcError.message);
//           } else {
//             setError(rpcError.message);
//           }
//           throw rpcError; // Re-throw for console logging
//         }

//         setError(null); // Clear any error after success
//         // Re-check status to update buttons and messages immediately after success
//         await checkVirtualDayStatus();
//       } catch (err: any) {
//         console.error("Check-in error (virtual):", err.message);
//         if (!error) {
//           // Only set if not already set by RPC check
//           setError(err.message);
//         }
//       } finally {
//         setLoading(false); // End loading regardless of success/failure
//       }
//     },
//     [activeReduction, checkVirtualDayStatus]
//   ); // Added checkVirtualDayStatus to deps

//   return { status, onCheckIn, loading, error };
// }

///////////////////////////

// hooks/userCheckIn.ts
import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ReductionPeriod } from "@/types/reductionTypes";
import {
  getVirtualDayInfo,
  getVirtualDateFromDayNumber, // Now takes a second argument
} from "@/utils/dateHelpers";

interface CheckInStatus {
  canCheckInToday: boolean;
  canCheckInYesterday: boolean;
  todayCheckedIn: boolean;
  yesterdayCheckedIn: boolean;
  currentVirtualDay: number;
  yesterdayVirtualDay: number;
  pledgeActive: boolean;
}

export function userCheckIn(activeReduction: ReductionPeriod | null) {
  const [status, setStatus] = useState<CheckInStatus>({
    canCheckInToday: false,
    canCheckInYesterday: false,
    todayCheckedIn: false,
    yesterdayCheckedIn: false,
    currentVirtualDay: -1,
    yesterdayVirtualDay: -1,
    pledgeActive: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkVirtualDayStatus = useCallback(async () => {
    if (!activeReduction || !activeReduction.start_date) {
      setStatus((prev) => ({ ...prev, pledgeActive: false }));
      return;
    }

    setError(null);

    try {
      const startDate = new Date(activeReduction.start_date);
      const { currentVirtualDay } = getVirtualDayInfo(startDate);
      const yesterdayVirtualDay =
        currentVirtualDay > 0 ? currentVirtualDay - 1 : -1;

      // --- MODIFIED: Pass startDate to getVirtualDateFromDayNumber ---
      const todayVirtualDateString = getVirtualDateFromDayNumber(
        currentVirtualDay,
        startDate
      );
      const yesterdayVirtualDateString =
        yesterdayVirtualDay >= 0
          ? getVirtualDateFromDayNumber(yesterdayVirtualDay, startDate)
          : null;
      // --- END MODIFIED ---

      const { data: checkIns, error: fetchError } = await supabase
        .from("check_ins")
        .select("check_in_date")
        .eq("reduction_id", activeReduction.id)
        .in(
          "check_in_date",
          [todayVirtualDateString, yesterdayVirtualDateString].filter(Boolean)
        );

      if (fetchError) {
        throw fetchError;
      }

      const todayCheckedIn = checkIns.some(
        (ci) =>
          getVirtualDateFromDayNumber(currentVirtualDay, startDate) ===
          ci.check_in_date
      );
      const yesterdayCheckedIn =
        yesterdayVirtualDay >= 0 &&
        checkIns.some(
          (ci) =>
            getVirtualDateFromDayNumber(yesterdayVirtualDay, startDate) ===
            ci.check_in_date
        );

      setStatus({
        canCheckInToday: !todayCheckedIn,
        canCheckInYesterday: yesterdayVirtualDay >= 0 && !yesterdayCheckedIn,
        todayCheckedIn,
        yesterdayCheckedIn,
        currentVirtualDay,
        yesterdayVirtualDay,
        pledgeActive: true,
      });
    } catch (err: any) {
      console.error("Error checking check-in status (virtual):", err.message);
      setError("Failed to check daily status.");
      setStatus((prev) => ({
        ...prev,
        pledgeActive: true,
        canCheckInToday: false,
        canCheckInYesterday: false,
      }));
    }
  }, [activeReduction]);

  useEffect(() => {
    checkVirtualDayStatus();

    const interval = setInterval(() => {
      checkVirtualDayStatus();
    }, 1000);

    return () => clearInterval(interval);
  }, [checkVirtualDayStatus]);

  const onCheckIn = useCallback(
    async (statusType: "dry" | "wet", targetVirtualDay: number) => {
      if (!activeReduction || !activeReduction.start_date) {
        setError("No active reduction period to check into.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;
        if (!user) {
          throw new Error("No user logged in. Please log in to check in.");
        }

        const startDate = new Date(activeReduction.start_date);
        const { currentVirtualDay } = getVirtualDayInfo(startDate);

        // Call the Supabase RPC function, passing the target and current virtual day numbers
        const { data: rpcResponse, error: rpcError } = await supabase.rpc(
          "handle_user_check_in",
          {
            p_user_id: user.id,
            p_reduction_id: activeReduction.id,
            p_status: statusType,
            p_target_virtual_day_number: targetVirtualDay,
            p_current_virtual_day_number: currentVirtualDay,
          }
        );

        if (rpcError) {
          console.error("RPC Error:", rpcError.message);
          if (
            rpcError.code === "23505" ||
            rpcError.message.includes("already checked in")
          ) {
            setError(
              `You've already checked in for virtual day ${targetVirtualDay}.`
            );
          } else if (rpcError.message.includes("Grace period expired")) {
            setError(rpcError.message);
          } else {
            setError(rpcError.message);
          }
          throw rpcError;
        }

        setError(null);
        await checkVirtualDayStatus();
      } catch (err: any) {
        console.error("Check-in error (virtual):", err.message);
        if (!error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    },
    [activeReduction, checkVirtualDayStatus]
  );

  return { status, onCheckIn, loading, error };
}
