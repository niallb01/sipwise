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

      const startDate = new Date();
      const durationDays = selectedDurationId ?? 0;
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + durationDays);

      const { data, error } = await supabase
        .from("reductions")
        .insert([
          {
            user_id: user.id,
            target: reductionTarget,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            duration: durationDays,
            days_dry: 0,
            days_wet: 0,
            missed_days: 0,
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
