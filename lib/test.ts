import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    const { data, error } = await supabase
      .from("reductions")
      .select("*")
      .limit(1);
    if (error) {
      console.error("Error querying Supabase:", error);
    } else {
      console.log("Success querying Supabase:", data);
    }
  } catch (err) {
    console.error("Unexpected error:", err);
  }
}

testConnection();
