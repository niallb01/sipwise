import { Stack } from "expo-router";

export default function ModalLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Reduction"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
}

// import { Stack } from "expo-router";

// export default function ModalLayout() {
//   return (
//     <Stack
//       screenOptions={{
//         presentation: "modal", // <— important
//         // gestureEnabled: true, // <— optional but helps
//         headerShown: false,
//       }}
//     />
//   );
// }
