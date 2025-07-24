// import { useState, useEffect } from "react";
// import { supabase } from "@/lib/supabaseClient";
// import { MS_PER_SIMULATED_DAY } from "@/constants/reductionConstants";
// import { ReductionPeriod } from "@/types/reductionTypes";

// export function userCheckIn(activeReduction: ReductionPeriod | null) {
//   const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Check if user already checked in today
//   useEffect(() => {
//     async function checkToday() {
//       if (!activeReduction) {
//         setHasCheckedInToday(false);
//         return;
//       }

//       try {
//         const { data: userData } = await supabase.auth.getUser();
//         const user = userData?.user;
//         if (!user) return;

//         const { data, error } = await supabase
//           .from("check_ins")
//           .select("date_and_time")
//           .eq("user_id", user.id)
//           .eq("reduction_id", activeReduction.id)
//           .order("date_and_time", { ascending: false })
//           .limit(1);

//         if (error) throw error;

//         if (data && data.length > 0) {
//           const lastCheckIn = new Date(data[0].date_and_time).getTime();
//           const now = Date.now();

//           setHasCheckedInToday(now - lastCheckIn < MS_PER_SIMULATED_DAY);
//         } else {
//           setHasCheckedInToday(false);
//         }
//       } catch (err: any) {
//         console.error("Check-in fetch error:", err.message);
//         setError(err.message);
//       }
//     }

//     checkToday();
//   }, [activeReduction]);

//   // Perform check-in
//   async function onCheckIn(status: "dry" | "wet") {
//     if (!activeReduction || hasCheckedInToday) return;

//     setLoading(true);
//     setError(null);

//     try {
//       const { data: userData } = await supabase.auth.getUser();
//       const user = userData?.user;
//       if (!user) throw new Error("No user logged in");

//       const now = new Date().toISOString();

//       // Insert check_in record
//       const { error: insertError } = await supabase.from("check_ins").insert([
//         {
//           user_id: user.id,
//           reduction_id: activeReduction.id,
//           status,
//           date_and_time: now,
//         },
//       ]);

//       if (insertError) throw insertError;

//       // Update reductions table count (replace this if no RPC)
//       const column = status === "dry" ? "days_dry" : "days_wet";
//       const { error: updateError } = await supabase
//         .from("reductions")
//         .update({ [column]: supabase.raw(`${column} + 1`) })
//         .eq("id", activeReduction.id);

//       if (updateError) throw updateError;

//       setHasCheckedInToday(true);
//     } catch (err: any) {
//       console.error("Check-in error:", err.message);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return { hasCheckedInToday, onCheckIn, loading, error };
// }

////////////////////////////////

// import { useState, useEffect } from "react";
// import { supabase } from "@/lib/supabaseClient";
// import { MS_PER_SIMULATED_DAY } from "@/constants/reductionConstants";
// import { ReductionPeriod } from "@/types/reductionTypes";

// export function userCheckIn(activeReduction: ReductionPeriod | null) {
//   const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Check if user already checked in today
//   useEffect(() => {
//     async function checkToday() {
//       if (!activeReduction) {
//         setHasCheckedInToday(false);
//         return;
//       }

//       try {
//         const { data: userData } = await supabase.auth.getUser();
//         const user = userData?.user;
//         if (!user) return;

//         const { data, error } = await supabase
//           .from("check_ins")
//           .select("date_and_time")
//           .eq("user_id", user.id)
//           .eq("reduction_id", activeReduction.id)
//           .order("date_and_time", { ascending: false })
//           .limit(1);

//         if (error) throw error;

//         if (data && data.length > 0) {
//           const lastCheckIn = new Date(data[0].date_and_time).getTime();
//           const now = Date.now();

//           // This logic defines what a "day" means for preventing re-check-ins.
//           // It needs to align with your MS_PER_SIMULATED_DAY constant.
//           setHasCheckedInToday(now - lastCheckIn < MS_PER_SIMULATED_DAY);
//         } else {
//           setHasCheckedInToday(false);
//         }
//       } catch (err: any) {
//         console.error("Check-in fetch error:", err.message);
//         setError(err.message);
//       }
//     }

//     // Call checkToday only if activeReduction is present or changes
//     // It's good practice to re-evaluate when activeReduction changes
//     checkToday();
//   }, [activeReduction]);

//   // Perform check-in using the Supabase RPC function
//   async function onCheckIn(status: "dry" | "wet") {
//     // Prevent check-in if no active reduction or already checked in today
//     if (!activeReduction || hasCheckedInToday) {
//       console.warn(
//         "Check-in prevented: No active reduction or already checked in today."
//       );
//       return;
//     }

//     setLoading(true); // Indicate loading state
//     setError(null); // Clear previous errors

//     try {
//       const { data: userData } = await supabase.auth.getUser();
//       const user = userData?.user;
//       if (!user) {
//         throw new Error("No user logged in. Please log in to check in.");
//       }

//       // *** THIS IS THE KEY CHANGE: Call your RPC function ***
//       const { error: rpcError } = await supabase.rpc("handle_user_check_in", {
//         p_user_id: user.id, // Parameter for user_id
//         p_reduction_id: activeReduction.id, // Parameter for reduction_id
//         p_status: status, // Parameter for 'dry' or 'wet' status
//       });

//       if (rpcError) {
//         // If the RPC function itself throws an exception (e.g., 'Unauthorized: User ID mismatch.'),
//         // it will be caught here.
//         throw rpcError;
//       }

//       // If RPC call succeeds, update local state to reflect successful check-in
//       setHasCheckedInToday(true);

//       // IMPORTANT: If your UI displays `days_dry` or `days_wet` from the `activeReduction`
//       // object, you'll need to re-fetch the `activeReduction` data or update its state
//       // after a successful check-in to show the new count.
//       // For example, if you have a prop like `onCheckInSuccess` that triggers a parent re-fetch:
//       // if (typeof onCheckInSuccess === 'function') {
//       //   onCheckInSuccess();
//       // }
//       // Or, if `activeReduction` is state in a parent component, and you pass a setter:
//       // setParentActiveReduction(prev => ({ ...prev, [column]: prev[column] + 1 }));
//       // For now, we're just setting hasCheckedInToday.
//     } catch (err: any) {
//       console.error("Check-in error:", err.message);
//       setError(err.message); // Set error state for UI display
//     } finally {
//       setLoading(false); // End loading state
//     }
//   }

//   // Return the state and functions for consumption by your component
//   return { hasCheckedInToday, onCheckIn, loading, error };
// }

///////////////////////////

import { useState, useEffect, useCallback } from "react"; // Import useCallback
import { supabase } from "@/lib/supabaseClient";
import { MS_PER_SIMULATED_DAY } from "@/constants/reductionConstants";
// import { ReductionPeriod } from "@/types/reductionTypes";
import { ReductionPeriod } from "@/types/reductionTypes";

export function userCheckIn(activeReduction: ReductionPeriod | null) {
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoize checkToday to prevent unnecessary re-creations
  const checkToday = useCallback(async () => {
    if (!activeReduction) {
      setHasCheckedInToday(false);
      return;
    }

    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) return;

      const { data, error } = await supabase
        .from("check_ins")
        .select("date_and_time")
        .eq("user_id", user.id)
        .eq("reduction_id", activeReduction.id)
        .order("date_and_time", { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const lastCheckIn = new Date(data[0].date_and_time).getTime();
        const now = Date.now();

        // This logic defines what a "day" means for preventing re-check-ins.
        setHasCheckedInToday(now - lastCheckIn < MS_PER_SIMULATED_DAY);
      } else {
        setHasCheckedInToday(false);
      }
    } catch (err: any) {
      console.error("Check-in fetch error:", err.message);
      setError(err.message);
    }
  }, [activeReduction]); // Dependency for checkToday itself

  // Set up an effect to run checkToday periodically and on initial load
  useEffect(() => {
    // Initial check
    checkToday();

    // Set up interval for re-checking (e.g., every 5 seconds for testing)
    // You might want to adjust this interval based on MS_PER_SIMULATED_DAY,
    // but a few seconds is fine for 10-second simulated days.
    const interval = setInterval(() => {
      checkToday();
    }, 5000); // Re-check every 5 seconds

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [checkToday]); // Dependency: re-run this effect if checkToday function itself changes (due to activeReduction)

  // Perform check-in using the Supabase RPC function
  async function onCheckIn(status: "dry" | "wet") {
    if (!activeReduction || hasCheckedInToday) {
      console.warn(
        "Check-in prevented: No active reduction or already checked in today."
      );
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

      const { error: rpcError } = await supabase.rpc("handle_user_check_in", {
        p_user_id: user.id,
        p_reduction_id: activeReduction.id,
        p_status: status,
      });

      if (rpcError) {
        throw rpcError;
      }

      // After successful check-in, explicitly re-run checkToday to update the state immediately
      await checkToday(); // <--- CRITICAL ADDITION HERE

      // No longer explicitly setting hasCheckedInToday(true) here,
      // as checkToday will handle it based on the latest database state.
    } catch (err: any) {
      console.error("Check-in error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { hasCheckedInToday, onCheckIn, loading, error };
}
