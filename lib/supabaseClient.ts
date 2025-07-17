import { createClient } from "@supabase/supabase-js"; // file because that file’s only job is to create and export the Supabase client instance.
import { storage } from "@/lib/storage"; // your platform-safe storage adapter
import { AppState } from "react-native";

// Use environment variables for safety (Expo uses EXPO_PUBLIC_ for client-side)
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: storage, // works on mobile & web
    autoRefreshToken: true, // refreshes tokens automatically
    persistSession: true, // persists session across app restarts
    detectSessionInUrl: false, // required for mobile (no URL redirects)
  },
});
///////////////////////////////////////////////////////////////////////////////////////////////////
// Make sure this runs only once, ideally in your app entry point or supabase init file
// So yes, to have persistent guest sessions in your React Native app, you should include this AppState logic.
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

// Exactly! Here's the typical flow you’d want:
// User starts as a guest (anonymous sign-in) — they get a temporary session that persists thanks to the AppState auto-refresh logic.
// They use the app, data is saved tied to their anonymous user ID.
// Later, if they want, they can create a full account by signing up (email/password or OAuth).
// You link their anonymous session data to their new permanent account so they don’t lose anything.
// Supabase’s auth system supports this kind of flow smoothly, letting you upgrade a guest session to a full user without losing data.
