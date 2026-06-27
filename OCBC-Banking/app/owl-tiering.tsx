import React, { useCallback } from "react";
import { Alert, ImageBackground, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { YStack } from "tamagui";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MILESTONES, OWLS, PALETTE, SCENE_ASPECT, Milestone, OwlProduct } from "../components/journey/journey.data";
import { MilestoneNode } from "../components/journey/MilestoneNode";
import { OwlCard } from "../components/journey/OwlCard";
import { TotalAssetsChip } from "../components/journey/TotalAssetsChip";
import { getHasCompletedOwlQuiz, setHasCompletedOwlQuiz, setPendingOwlDestination } from "../components/wealth/navigationState";

export default function OwlTieringScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleMilestone = useCallback((m: Milestone) => {
    console.log("milestone", m.id, m.state);
  }, []);

  /**
   * Determine the real destination for each owl, then either:
   *  - Route straight there (quiz already done), or
   *  - Store the destination and start the quiz (first time).
   */
  const handleOwl = useCallback((owl: OwlProduct) => {
    let destination: string | null = null;

    if (owl.id === "planning") {
      destination = "/(tabs)/planning-owl";
    } else if (owl.id === "deposit") {
      destination = "/smart-deposit-details";
    } else if (owl.id === "investment") {
      destination = "/wealth/dashboard";
    }

    if (destination === null) {
      Alert.alert("Coming soon", "This Owl module will be available in a future prototype pass.");
      return;
    }

    if (getHasCompletedOwlQuiz()) {
      // Quiz already done — go straight to the destination.
      router.push(destination as any);
    } else {
      // First time hitting any owl — run the quiz first, then redirect.
      setHasCompletedOwlQuiz(true);
      setPendingOwlDestination(destination);
      router.push("/wealth/onboarding");
    }
  }, [router]);

  return (
    <ScrollView
      style={{ backgroundColor: PALETTE.bg }}
      contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Painted scene with live-coded milestone nodes */}
      <ImageBackground
        source={require("../assets/images/journey-scene.png")}
        resizeMode="cover"
        style={[styles.scene, { aspectRatio: SCENE_ASPECT }]}
      >
        <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
          <Pressable onPress={() => router.replace("/(tabs)/home")} hitSlop={12} style={styles.hbtn}>
            <Ionicons name="chevron-back" size={22} color={PALETTE.maroon} />
          </Pressable>
          <Pressable
            onPress={() =>
              Alert.alert("Owl Path", "Grow your relationship tier to unlock more Owl capabilities.")
            }
            hitSlop={12}
            style={styles.hbtn}
          >
            <Ionicons name="help-circle-outline" size={24} color={PALETTE.maroon} />
          </Pressable>
        </View>

        {MILESTONES.map((m) => (
          <MilestoneNode key={m.id} milestone={m} onPress={handleMilestone} />
        ))}

        <TotalAssetsChip />
      </ImageBackground>

      {/* Card sheet overlapping the scene */}
      <YStack
        backgroundColor={PALETTE.sheet}
        borderTopLeftRadius={28}
        borderTopRightRadius={28}
        marginTop={-28}
        paddingHorizontal={16}
        paddingTop={20}
        gap={14}
      >
        {OWLS.map((owl) => (
          <OwlCard key={owl.id} owl={owl} onPressCta={handleOwl} />
        ))}
      </YStack>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scene: { width: "100%" },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  hbtn: { width: 38, height: 38, alignItems: "center", justifyContent: "center" },
});
