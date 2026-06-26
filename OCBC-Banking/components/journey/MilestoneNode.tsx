// MilestoneNode.tsx
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "tamagui";
import { MotiView } from "moti";
import { useReducedMotion } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Milestone, PALETTE } from "./journey.data";

const DOT_SIZE: Record<Milestone["size"], number> = { sm: 22, md: 30, lg: 30 };

interface Props {
  milestone: Milestone;
  onPress: (m: Milestone) => void;
}

/**
 * A single milestone marker. The wrapper is a zero-size anchor placed at the
 * (x%, y%) point on the scene; the dot and label are laid out around it.
 * RN can't do percentage transforms, so we center the dot with negative margins.
 */
export function MilestoneNode({ milestone, onPress }: Props) {
  const reduceMotion = useReducedMotion();
  const size = DOT_SIZE[milestone.size];
  const filled = milestone.state === "done" || milestone.state === "current";
  const locked = milestone.state === "locked";

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.anchor,
        { left: `${milestone.x}%`, top: `${milestone.y}%` },
      ]}
    >
      {/* Label + range sit to the LEFT of the dot (right-aligned to the anchor point) */}
      <View style={[styles.labelWrap, { right: size / 2 + 8 }]}>
        <View style={styles.labelText}>
          <Text
            fontSize={12.5}
            fontWeight="600"
            color={locked ? "#9A8E80" : PALETTE.ink}
            numberOfLines={1}
            style={locked && styles.lockedLabel}
          >
            {milestone.label}
          </Text>
          <Text
            fontSize={9.5}
            fontWeight="500"
            color={locked ? "#B0A498" : PALETTE.ink}
            numberOfLines={1}
          >
            {milestone.range}
          </Text>
        </View>
        <View style={styles.leaderTrack}>
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={[styles.dash, { backgroundColor: locked ? "#B49A86" : PALETTE.ink }]}
            />
          ))}
        </View>
      </View>

      {/* The dot, centered on the anchor point */}
      <Pressable
        disabled={locked}
        onPress={() => onPress(milestone)}
        hitSlop={10}
        style={[
          styles.dot,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            marginLeft: -size / 2,
            marginTop: -size / 2,
            backgroundColor: filled ? PALETTE.maroon : "#fff",
            borderColor: filled ? PALETTE.maroon : PALETTE.ring,
            opacity: locked ? 0.55 : 1,
          },
        ]}
      >
        {milestone.state === "done" && <Ionicons name="checkmark" size={15} color="#fff" />}
        {milestone.state === "current" && <View style={styles.centerDot} />}

        {/* Pulsing ring on the current milestone (skipped if reduce-motion is on) */}
        {milestone.state === "current" && !reduceMotion && (
          <MotiView
            pointerEvents="none"
            from={{ scale: 0.9, opacity: 0.7 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ type: "timing", duration: 1800, loop: true, repeatReverse: false }}
            style={[
              styles.pulse,
              { width: size, height: size, borderRadius: size / 2 },
            ]}
          />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  anchor: { position: "absolute", width: 0, height: 0 },
  dot: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2.5,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  centerDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#fff" },
  pulse: { position: "absolute", borderWidth: 2, borderColor: PALETTE.maroon },
  labelWrap: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    top: -18, // raised to keep the two-line block centred on the dot
    // right is set inline so it hugs the left of the dot
  },
  labelText: {
    alignItems: "flex-end", // right-align both lines so they stack neatly against the leader
  },
  leaderTrack: { flexDirection: "row", alignItems: "center", gap: 2.5 },
  dash: { width: 4, height: 1.5 },
  lockedLabel: { textTransform: "uppercase", letterSpacing: 0.5, opacity: 0.8 },
});
