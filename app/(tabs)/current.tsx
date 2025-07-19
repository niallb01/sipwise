import { View, Text, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ReductionPeriod } from "@/types/reductionTypes";

export default function Current() {
  const [activeReduction, setActiveReduction] =
    useState<ReductionPeriod | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActiveReduction() {
      setLoading(true);
      try {
        const now = new Date().toISOString();

        const { data, error } = await supabase
          .from("reductions")
          .select(
            `
            id,
            target,
            start_date,
            end_date,
            duration,
            days_dry,
            days_wet,
            missed_days
          `
          )
          .gte("end_date", now) // Only active (not expired) pledges
          .order("start_date", { ascending: false })
          .limit(1);

        if (error) throw error;

        setActiveReduction(data?.[0] || null);
      } catch (error) {
        console.error("Error fetching active reduction:", error);
        setActiveReduction(null);
      } finally {
        setLoading(false);
      }
    }

    fetchActiveReduction();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading your reduction period...</Text>
      </View>
    );
  }

  if (!activeReduction) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No active reduction period found.</Text>
      </View>
    );
  }

  const {
    target,
    start_date,
    end_date,
    duration,
    days_dry,
    days_wet,
    missed_days,
  } = activeReduction;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Reduction period: {duration} day{duration !== 1 ? "s" : ""}
      </Text>
      <Text style={styles.text}>Target alcohol-free days: {target}</Text>
      <Text style={styles.text}>
        Start Date: {new Date(start_date).toLocaleString()}
      </Text>
      <Text style={styles.text}>
        End Date: {new Date(end_date).toLocaleString()}
      </Text>
      <Text style={styles.text}>Days Dry: {days_dry}</Text>
      <Text style={styles.text}>Days Wet: {days_wet}</Text>
      <Text style={styles.text}>Missed Days: {missed_days}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "300",
    fontFamily: 'IonEina, "Helvetica Neue", Helvetica, sans-serif',
    letterSpacing: 0.7,
    marginVertical: 4,
  },
});
