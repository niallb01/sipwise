//  Imports the Platform API from React Native.
// Used to check whether the app is running on "web", "ios", or "android".
import { Platform } from "react-native";

// Define the storage interface getItem: async getter for a string value, setItem: async setter, removeItem: async remover, Each method returns a Promise.

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
