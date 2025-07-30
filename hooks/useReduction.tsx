import { MS_PER_SIMULATED_DAY } from "@/constants/reductionConstants";
import { useAtom } from "jotai";
import {
  selectedReductionDurationAtom,
  reductionTargetAtom,
} from "@/atoms/reductionAtoms";
import { supabase } from "@/lib/supabaseClient";

export function useReduction() {
  // Hooks called here, inside a React hook
  const [selectedDurationId] = useAtom(selectedReductionDurationAtom);
  const [reductionTarget] = useAtom(reductionTargetAtom);

  const ensureUser = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      const { data, error: anonError } =
        await supabase.auth.signInAnonymously();
      if (anonError) throw anonError;
      return data.user!;
    }

    return user;
  };

  const onStartReductionPeriod = async () => {
    try {
      const user = await ensureUser();

      // Set startDate 2 seconds in the future for reliable testing
      const startDate = new Date(Date.now() + 2000);

      const durationDays = selectedDurationId ?? 0; // days
      const durationMs = durationDays * MS_PER_SIMULATED_DAY; // milliseconds

      const endDate = new Date(startDate.getTime() + durationMs); // correct endDate

      console.log(`Creating pledge: ${durationDays} days = ${durationMs}ms`);
      console.log(`Start: ${startDate.toISOString()}`);
      console.log(`End: ${endDate.toISOString()}`);
      console.log(`Duration: ${durationMs / 1000 / 60} minutes`);

      // CRUD - When a user starts a new pledge, you create a new record in the reductions table
      const { data, error } = await supabase
        .from("reductions")
        .insert([
          {
            user_id: user.id,
            target: reductionTarget,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            duration: durationDays, // store days, not milliseconds
            days_dry: 0,
            days_wet: 0,
            missed_days: 0,
            ////////////////////// new
            status: "active", // explicitly set active
          },
        ])
        .select();

      if (error) {
        console.error("Failed to start reduction:", error);
        return null;
      } else {
        console.log("Reduction started:", data);
        return data;
      }
    } catch (error) {
      console.error("User sign-in error:", error);
      return null;
    }
  };

  return { onStartReductionPeriod };
}
