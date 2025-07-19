import { Text, View, StyleSheet, FlatList } from "react-native";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ReductionPeriod } from "@/types/reductionTypes";

export default function Stats() {
  const [completedReductions, setCompletedReductions] = useState<
    ReductionPeriod[]
  >([]);
  const [loading, setLoading] = useState(true);

  // side effect async data fetch
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
        setCompletedReductions((data || []) as ReductionPeriod[]);
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
      <Text style={styles.header}>Completed Alcohol Reduction Periods</Text>
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
    marginTop: 5,
    fontSize: 14,
    textAlign: "center",
    fontWeight: 300,
    fontFamily: 'IonEina, "Helvetica Neue", Helvetica, sans-serif',
    letterSpacing: 0.7,
  },
  header: {
    fontSize: 18,
    fontWeight: "400",
    marginBottom: 20,
  },
  card: {
    padding: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    marginVertical: 8,
    width: "100%",
  },
});
