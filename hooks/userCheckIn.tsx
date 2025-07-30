import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ReductionPeriod } from "@/types/reductionTypes";

export function userCheckIn(activeReduction: ReductionPeriod | null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onCheckIn = useCallback(
    async (statusType: "dry" | "wet") => {
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

        console.log(`onCheckIn: Attempting check-in as ${statusType}`);

        const { data: rpcResponse, error: rpcError } = await supabase.rpc(
          "handle_user_check_in",
          {
            p_user_id: user.id,
            p_reduction_id: activeReduction.id,
            p_status: statusType,
            p_check_in_timestamp: new Date().toISOString(),
          }
        );

        if (rpcError) {
          console.error("onCheckIn: RPC Error:", rpcError.message);
            setError(rpcError.message);
          throw rpcError;
        }

        console.log("onCheckIn: Check-in successful");
      } catch (err: any) {
        console.error("onCheckIn: Error:", err.message);
          setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [activeReduction]
  );

  return {
    onCheckIn,
    loading,
    error,
  };
}
