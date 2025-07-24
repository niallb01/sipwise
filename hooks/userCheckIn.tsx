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

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { MS_PER_SIMULATED_DAY } from "@/constants/reductionConstants";
import { ReductionPeriod } from "@/types/reductionTypes";

export function userCheckIn(activeReduction: ReductionPeriod | null) {
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user already checked in today
  useEffect(() => {
    async function checkToday() {
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
          // It needs to align with your MS_PER_SIMULATED_DAY constant.
          setHasCheckedInToday(now - lastCheckIn < MS_PER_SIMULATED_DAY);
        } else {
          setHasCheckedInToday(false);
        }
      } catch (err: any) {
        console.error("Check-in fetch error:", err.message);
        setError(err.message);
      }
    }

    // Call checkToday only if activeReduction is present or changes
    // It's good practice to re-evaluate when activeReduction changes
    checkToday();
  }, [activeReduction]);

  // Perform check-in using the Supabase RPC function
  async function onCheckIn(status: "dry" | "wet") {
    // Prevent check-in if no active reduction or already checked in today
    if (!activeReduction || hasCheckedInToday) {
      console.warn(
        "Check-in prevented: No active reduction or already checked in today."
      );
      return;
    }

    setLoading(true); // Indicate loading state
    setError(null); // Clear previous errors

    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) {
        throw new Error("No user logged in. Please log in to check in.");
      }

      // *** THIS IS THE KEY CHANGE: Call your RPC function ***
      const { error: rpcError } = await supabase.rpc("handle_user_check_in", {
        p_user_id: user.id, // Parameter for user_id
        p_reduction_id: activeReduction.id, // Parameter for reduction_id
        p_status: status, // Parameter for 'dry' or 'wet' status
      });

      if (rpcError) {
        // If the RPC function itself throws an exception (e.g., 'Unauthorized: User ID mismatch.'),
        // it will be caught here.
        throw rpcError;
      }

      // If RPC call succeeds, update local state to reflect successful check-in
      setHasCheckedInToday(true);

      // IMPORTANT: If your UI displays `days_dry` or `days_wet` from the `activeReduction`
      // object, you'll need to re-fetch the `activeReduction` data or update its state
      // after a successful check-in to show the new count.
      // For example, if you have a prop like `onCheckInSuccess` that triggers a parent re-fetch:
      // if (typeof onCheckInSuccess === 'function') {
      //   onCheckInSuccess();
      // }
      // Or, if `activeReduction` is state in a parent component, and you pass a setter:
      // setParentActiveReduction(prev => ({ ...prev, [column]: prev[column] + 1 }));
      // For now, we're just setting hasCheckedInToday.
    } catch (err: any) {
      console.error("Check-in error:", err.message);
      setError(err.message); // Set error state for UI display
    } finally {
      setLoading(false); // End loading state
    }
  }

  // Return the state and functions for consumption by your component
  return { hasCheckedInToday, onCheckIn, loading, error };
}

///////////////////////////

// useEffect(() => {
//   const checkToday = async () => {
//     if (!activeReduction) return;

//     const { data: userData } = await supabase.auth.getUser();
//     const user = userData?.user;
//     if (!user) return;

//     const { data, error } = await supabase
//       .from("check_ins")
//       .select("created_at")
//       .eq("user_id", user.id)
//       .eq("reduction_id", activeReduction.id)
//       .order("created_at", { ascending: false })
//       .limit(1);

//     if (error) {
//       console.error("Checkin fetch error:", error);
//       return;
//     }

//     if (data.length > 0) {
//       const last = new Date(data[0].created_at).getTime();
//       if (Date.now() - last < MS_PER_SIMULATED_DAY) {
//         setHasCheckedInToday(true);
//       }
//     }
//   };

//   checkToday();
// }, [activeReduction]);

// const onCheckIn = async (status: "dry" | "wet") => {
//   if (!activeReduction || hasCheckedInToday) return;

//   const { data: userData } = await supabase.auth.getUser();
//   const user = userData?.user;
//   if (!user) return;

//   const now = new Date().toISOString();
//   // Insert new check_in with status (dry or wet)
//   const { error: insertError } = await supabase.from("check_ins").insert([
//     {
//       user_id: user.id,
//       reduction_id: activeReduction.id,
//       status,
//       //
//       date_and_time: now, // <-- Add this line
//     },
//   ]);

//   if (insertError) {
//     console.error("Check-in insert failed:", insertError);
//     return;
//   }

//   // Increment corresponding column in reductions
//   const column = status === "dry" ? "days_dry" : "days_wet";
//   const { error: updateError } = await supabase.rpc("increment_column", {
//     table_name: "reductions",
//     column_name: column,
//     row_id: activeReduction.id,
//   });

//   if (updateError) {
//     console.error("Check-in update failed:", updateError);
//     return;
//   }

//   setHasCheckedInToday(true);
//   fetchActiveReduction();
// };
