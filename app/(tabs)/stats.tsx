// import { Text, View, StyleSheet } from "react-native";

// export default function Stats() {
//   return (
//     <>
//       <View style={styles.container}>
//         <Text style={styles.text}>Stats</Text>
//       </View>
//     </>
//   );
// }

import { Text, View, StyleSheet, FlatList } from "react-native";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Stats() {
  const [completedReductions, setCompletedReductions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompletedReductions() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("reductions")
          .select("*")
          .lt("end_date", new Date().toISOString()) // ended in the past
          .order("end_date", { ascending: false });

        if (error) throw error;
        setCompletedReductions(data || []);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        setCompletedReductions([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCompletedReductions();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading stats...</Text>
      </View>
    );
  }

  if (completedReductions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No completed pledges yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Completed Pledges</Text>
      <FlatList
        data={completedReductions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.text}>
              Duration: {item.duration} day{item.duration !== 1 ? "s" : ""}
            </Text>
            <Text style={styles.text}>Target: {item.target} dry days</Text>
            <Text style={styles.text}>Dry: {item.days_dry}</Text>
            <Text style={styles.text}>Wet: {item.days_wet}</Text>
            <Text style={styles.text}>Missed: {item.missed_days}</Text>
            <Text style={styles.text}>
              {new Date(item.start_date).toLocaleDateString()} →{" "}
              {new Date(item.end_date).toLocaleDateString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
    fontWeight: 300,
    fontFamily: 'IonEina, "Helvetica Neue", Helvetica, sans-serif',
    letterSpacing: 0.7,
  },
  header: {
    fontSize: 22,
    fontWeight: "500",
    marginBottom: 20,
  },
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    marginVertical: 8,
    width: "100%",
  },
});
