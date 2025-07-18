/// <reference types="https://deno.land/std@0.177.0/types.d.ts" />
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
serve(async (_req) => {
    const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SERVICE_ROLE_KEY") // ✅ Updated to match your secret
    );
    const now = new Date().toISOString();
    const { error } = await supabase
        .from("reductions")
        .update({ status: "completed" })
        .eq("status", "active")
        .lte("end_date", now);
    if (error) {
        console.error("Error updating pledge statuses:", error);
        return new Response("Error updating pledges", { status: 500 });
    }
    return new Response("Pledges updated successfully", { status: 200 });
});
