// // import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
// // // import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// // import { createClient } from "https://deno.land/x/supabase@1.2.0/mod.ts";

// import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
// import { createClient } from "https://deno.land/x/supabase@1.2.0/mod.ts";

// serve(async (_req: Request): Promise<Response> => {
//   const supabase = createClient(
//     Deno.env.get("SUPABASE_URL")!,
//     Deno.env.get("SERVICE_ROLE_KEY")! // ✅ Updated to match your secret
//   );

//   const now = new Date().toISOString();

//   const { error } = await supabase
//     .from("reductions")
//     .update({ status: "completed" })
//     .eq("status", "active")
//     .lte("end_date", now);

//   if (error) {
//     console.error("Error updating pledge statuses:", error);
//     return new Response("Error updating pledges", { status: 500 });
//   }

//   return new Response("Pledges updated successfully", { status: 200 });
// });

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://deno.land/x/supabase@1.2.0/mod.ts";

serve(async (_req: Request): Promise<Response> => {
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")!;

  console.log("Connecting to Supabase with URL:", SUPABASE_URL);

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

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
