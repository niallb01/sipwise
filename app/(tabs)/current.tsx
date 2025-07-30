import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { supabase } from "@/lib/supabaseClient";
import { ReductionPeriod } from "@/types/reductionTypes";
import { formatDateToLocalWithTZ } from "@/utils/dateHelpers";
import Button from "@/components/Button";
import { userCheckIn } from "@/hooks/userCheckIn";

export default function Current() {
  const [activeReduction, setActiveReduction] =
    useState<ReductionPeriod | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    onCheckIn,
    loading: checkInLoading,
    error: checkInError,
  } = userCheckIn(activeReduction);

  const fetchActiveReduction = async () => {
    try {
      console.log("🔍 Fetching active reduction...");
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      const user = userData?.user;

      if (userError || !user) {
        console.log("❌ User not logged in:", userError?.message);
        setError("Please log in to view your active pledge.");
        return;
      }

      console.log("✅ User logged in:", user.id);

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
          missed_days,
          current_streak,
          status
        `
        )
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("start_date", { ascending: false })
        .limit(1);

      if (error) {
        console.log("❌ Database error:", error.message);
        throw error;
      }

      console.log("📊 Query result:", data);
      setActiveReduction(data?.[0] || null);
    } catch (error: any) {
      console.log("❌ Fetch error:", error.message);
      setError(`Failed to load pledge: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveReduction();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading your pledge...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={[styles.text, { color: "red" }]}>{error}</Text>
      </View>
    );
  }

  if (!activeReduction) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No active pledge found.</Text>
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
    current_streak,
  } = activeReduction;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Active Pledge</Text>

      <Text style={styles.text}>
        Duration: {duration} day{duration !== 1 ? "s" : ""}
      </Text>
      <Text style={styles.text}>Target: {target} alcohol-free days</Text>
      <Text style={styles.text}>
        Started: {formatDateToLocalWithTZ(start_date)}
      </Text>
      <Text style={styles.text}>Ends: {formatDateToLocalWithTZ(end_date)}</Text>

      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>Days Dry: {days_dry || 0}</Text>
        <Text style={styles.statsText}>Days Wet: {days_wet || 0}</Text>
        <Text style={styles.statsText}>Missed: {missed_days || 0}</Text>
        <Text style={styles.statsText}>Streak: {current_streak || 0}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Text style={styles.text}>Check in for today:</Text>
        <Button label="No Alcohol (Dry)" onPress={() => onCheckIn("dry")} />
        <Button label="Had Alcohol (Wet)" onPress={() => onCheckIn("wet")} />
        <Button
          label="🔄 Refresh Data"
          onPress={() => fetchActiveReduction()}
        />
      </View>

      {/* Grace Period Section */}
      {missed_days > 0 && (
        <View style={styles.gracePeriodContainer}>
          <Text style={styles.text}>
            Grace Period - Check in for previous days:
          </Text>
          <Button
            label="No Alcohol (Dry) - Previous Day"
            onPress={() => onCheckIn("dry")}
          />
          <Button
            label="Had Alcohol (Wet) - Previous Day"
            onPress={() => onCheckIn("wet")}
          />
          <Text style={styles.smallText}>
            You can update missed days to dry/wet within the grace period
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 4,
  },
  statsContainer: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    width: "100%",
  },
  statsText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 2,
    fontWeight: "500",
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
  },
  gracePeriodContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    width: "100%",
  },
  smallText: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 10,
    color: "#666",
  },
});
