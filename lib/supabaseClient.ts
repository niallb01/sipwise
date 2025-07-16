// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { createClient, processLock } from "@supabase/supabase-js";
// import { AppState } from "react-native";
// import "react-native-url-polyfill/auto";

// const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
// const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// export const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
//   auth: {
//     storage: AsyncStorage,
//     autoRefreshToken: true,
//     persistSession: true,
//     detectSessionInUrl: false,
//     lock: processLock,
//   },
// });

// AppState.addEventListener("change", (state) => {
//   if (state === "active") {
//     supabase.auth.startAutoRefresh();
//   } else {
//     supabase.auth.stopAutoRefresh();
//   }
// });

import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storage } from "@/lib/storage";

const supabaseUrl = "https://lujjlncslvvgyxryyfsv.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1ampsbmNzbHZ2Z3l4cnl5ZnN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwODA4NDIsImV4cCI6MjA2NzY1Njg0Mn0.iGJGVwjUF2o5W1qSpWgWcTFjDoqPkiCPHsAxWxmCGCU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // storage: AsyncStorage,
    storage: storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
