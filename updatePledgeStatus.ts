import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://deno.land/x/supabase@1.2.0/mod.ts";

const MS_PER_SIMULATED_DAY = 10_000; // 10 seconds for testing

serve(async (_req: Request): Promise<Response> => {
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")!;

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const now = new Date();

  // 1. Update completed pledges (your existing logic)
  const { error: updateError } = await supabase
    .from("reductions")
    .update({ status: "completed" })
    .eq("status", "active")
    .lte("end_date", now.toISOString());

  if (updateError) {
    console.error("Error updating reduction/pledge statuses:", updateError);
    return new Response("Error updating reduction/pledges", { status: 500 });
  }

  // 2. Insert "missed" check-ins for expired days
  // Fetch all active reductions
  const { data: activeReductions, error: fetchError } = await supabase
    .from("reductions")
    .select("id, user_id, start_date, end_date, status")
    .eq("status", "active");

  if (fetchError) {
    console.error("Error fetching active reductions:", fetchError);
    return new Response("Error fetching active reductions", { status: 500 });
  }

  for (const reduction of activeReductions ?? []) {
    const startDate = new Date(reduction.start_date);
    const endDate = new Date(reduction.end_date);
    const userId = reduction.user_id;
    const reductionId = reduction.id;

    const nowMs = now.getTime();
    const startMs = startDate.getTime();
    const endMs = endDate.getTime();

    console.log(
      `Reduction ${reductionId} for user ${userId}: start=${startDate.toISOString()}, end=${endDate.toISOString()}, now=${now.toISOString()}`
    );

    for (let day = 0; ; day++) {
      const dayStart = new Date(startMs + day * MS_PER_SIMULATED_DAY);
      const gracePeriodEnd = dayStart.getTime() + 2 * MS_PER_SIMULATED_DAY;

      // Stop if this day hasn't started yet
      if (dayStart.getTime() > nowMs) {
        console.log(
          `  Day ${day} has not started yet (dayStart=${dayStart.toISOString()}, now=${now.toISOString()}). Breaking loop.`
        );
        break;
      }

      // Skip if grace period hasn't expired
      if (nowMs < gracePeriodEnd) {
        console.log(
          `  Grace period not expired for day ${day} (dayStart=${dayStart.toISOString()}, gracePeriodEnd=${new Date(
            gracePeriodEnd
          ).toISOString()}, now=${now.toISOString()}). Skipping.`
        );
        continue;
      }

      // Check if a check-in exists for this day
      const { data: checkIns, error: checkInError } = await supabase
        .from("check_ins")
        .select("id")
        .eq("reduction_id", reductionId)
        .eq("user_id", userId)
        .gte("date_and_time", dayStart.toISOString())
        .lt(
          "date_and_time",
          new Date(dayStart.getTime() + MS_PER_SIMULATED_DAY).toISOString()
        );

      if (checkInError) {
        console.error(
          `    Error checking for existing check-in for day ${day}:`,
          checkInError
        );
        continue;
      }

      if (checkIns && checkIns.length === 0) {
        console.log(`    No check-in found for day ${day}, inserting missed.`);
        const { error: insertError } = await supabase.from("check_ins").insert([
          {
            reduction_id: reductionId,
            user_id: userId,
            status: "missed",
            date_and_time: dayStart.toISOString(),
            check_in_date: dayStart.toISOString().slice(0, 10), // YYYY-MM-DD
          },
        ]);
        if (insertError) {
          console.error(
            `    Error inserting missed check-in for day ${day}:`,
            insertError
          );
        } else {
          console.log(
            `    Inserted missed check-in for reduction ${reductionId}, user ${userId}, day ${day}`
          );
        }
      } else {
        console.log(`    Check-in already exists for day ${day}, skipping.`);
      }
    }
  }

  return new Response(
    "Pledges/reduction and missed days updated successfully",
    {
      status: 200,
    }
  );
});
