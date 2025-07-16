// import { Platform } from "react-native";

// let storage;

// if (Platform.OS === "web") {
//   // Web storage using localStorage
//   storage = {
//     getItem: async (key) => {
//       try {
//         if (typeof window !== "undefined" && window.localStorage) {
//           return window.localStorage.getItem(key);
//         }
//         return null;
//       } catch (error) {
//         console.warn("Storage getItem error:", error);
//         return null;
//       }
//     },
//     setItem: async (key, value) => {
//       try {
//         if (typeof window !== "undefined" && window.localStorage) {
//           window.localStorage.setItem(key, value);
//         }
//       } catch (error) {
//         console.warn("Storage setItem error:", error);
//       }
//     },
//     removeItem: async (key) => {
//       try {
//         if (typeof window !== "undefined" && window.localStorage) {
//           window.localStorage.removeItem(key);
//         }
//       } catch (error) {
//         console.warn("Storage removeItem error:", error);
//       }
//     },
//   };
// } else {
//   // Mobile storage using AsyncStorage
//   const AsyncStorage =
//     require("@react-native-async-storage/async-storage").default;
//   storage = AsyncStorage;
// }

// export { storage };

import { Platform } from "react-native";

// Define the storage interface
interface StorageInterface {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
}

let storage: StorageInterface;

if (Platform.OS === "web") {
  // Web storage using localStorage
  storage = {
    getItem: async (key: string): Promise<string | null> => {
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          return window.localStorage.getItem(key);
        }
        return null;
      } catch (error) {
        console.warn("Storage getItem error:", error);
        return null;
      }
    },
    setItem: async (key: string, value: string): Promise<void> => {
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.setItem(key, value);
        }
      } catch (error) {
        console.warn("Storage setItem error:", error);
      }
    },
    removeItem: async (key: string): Promise<void> => {
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.removeItem(key);
        }
      } catch (error) {
        console.warn("Storage removeItem error:", error);
      }
    },
  };
} else {
  // Mobile storage using AsyncStorage
  const AsyncStorage =
    require("@react-native-async-storage/async-storage").default;
  storage = AsyncStorage as StorageInterface;
}

export { storage };
export type { StorageInterface };
