// app/(modals)/_layout.tsx
import { Stack } from "expo-router";

export default function ModalLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: "modal", // ✅ All modals are native-style
        gestureEnabled: true, // ✅ Swipe to dismiss on iOS
        headerShown: false, // 👌 Customize per screen if needed
      }}
    />
  );
}
