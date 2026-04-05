import React, { useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";
import { MoodOption } from "@/context/NotificationContext";

type Props = {
  mood: MoodOption;
  onPress: () => void;
  disabled?: boolean;
};

export function MoodCard({ mood, onPress, disabled }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.93, duration: 80, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 200, friction: 10 }),
    ]).start();
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
    >
      <Animated.View
        style={[
          styles.card,
          { backgroundColor: mood.gradient[0], borderColor: mood.color + "44" },
          { transform: [{ scale }] },
        ]}
      >
        <View style={[styles.emojiCircle, { backgroundColor: mood.color + "22" }]}>
          <Text style={styles.emoji}>{mood.emoji}</Text>
        </View>
        <Text style={[styles.label, { color: "#1a1a2e" }]}>{mood.label}</Text>
        <View style={[styles.dot, { backgroundColor: mood.color }]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
    minWidth: "45%",
  },
  pressed: {
    opacity: 0.85,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1.5,
    minHeight: 140,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  emojiCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 28,
  },
  label: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
    letterSpacing: 0.2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
