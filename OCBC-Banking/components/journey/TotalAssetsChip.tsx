// TotalAssetsChip.tsx
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Text } from "tamagui";
import { BlurView } from "expo-blur";
import { PALETTE, TOTAL_ASSETS, formatSGD } from "./journey.data";

// Owl mascot sits at roughly x=58.6%, y=61% of the scene image.
// The chip anchors at the owl's right edge (x=62%) at the same vertical
// centre so the connector reads as a direct label for the owl.
const CENTER_X = "62%";
const CENTER_Y = "61%";

const CHIP_WIDTH = 102;   // slightly wider than before to fit "Cash & Investments"
const CHIP_HEIGHT = 50;   // taller than before to fit the extra copy line

const CONNECTOR_DOT_R = 3;
const CONNECTOR_LINE_W = 16;

export function TotalAssetsChip() {
  return (
    <View
      pointerEvents="none"
      style={[
        styles.anchor,
        {
          left: CENTER_X,
          top: CENTER_Y,
          marginTop: -CHIP_HEIGHT / 2,
        },
      ]}
    >
      <View style={styles.row}>
        {/* Connector: small dot at the owl end + thin line leading to chip */}
        <View style={styles.connectorRow}>
          <View style={styles.dot} />
          <View style={styles.line} />
        </View>

        {/* Chip */}
        <BlurView intensity={28} tint="light" style={styles.blur}>
          <Text fontSize={7} fontWeight="700" letterSpacing={0.6} color={PALETTE.sub}>
            TOTAL ASSETS
          </Text>
          <Text fontSize={13} fontWeight="800" color={PALETTE.maroon} lineHeight={16}>
            {formatSGD(TOTAL_ASSETS)}
          </Text>
          <Text fontSize={6.5} color={PALETTE.sub} lineHeight={10}>
            Cash & Investments
          </Text>
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  anchor: { position: "absolute" },
  row: { flexDirection: "row", alignItems: "center" },
  connectorRow: { flexDirection: "row", alignItems: "center" },
  dot: {
    width: CONNECTOR_DOT_R * 2,
    height: CONNECTOR_DOT_R * 2,
    borderRadius: CONNECTOR_DOT_R,
    backgroundColor: PALETTE.maroon,
    opacity: 0.65,
  },
  line: {
    width: CONNECTOR_LINE_W,
    height: 1.5,
    backgroundColor: PALETTE.maroon,
    opacity: 0.4,
  },
  blur: {
    height: CHIP_HEIGHT,
    width: CHIP_WIDTH,
    borderRadius: 10,
    overflow: "hidden", // required for rounded corners on the blur
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    // Translucent fallback so it still reads cleanly if blur is unavailable
    backgroundColor:
      Platform.OS === "android" ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.45)",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
});
