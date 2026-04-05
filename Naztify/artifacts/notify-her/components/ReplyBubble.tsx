import React, { useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";

type Props = {
  text: string;
  emoji: string;
  onDismiss: () => void;
};

export function ReplyBubble({ text, emoji, onDismiss }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, tension: 120, friction: 8 }),
    ]).start();
  }, []);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: -20, duration: 250, useNativeDriver: true }),
    ]).start(() => onDismiss());
  };

  return (
    <Animated.View style={[styles.container, { opacity, transform: [{ translateY }] }]}>
      <Pressable onPress={dismiss} style={styles.bubble}>
        <View style={styles.header}>
          <View style={styles.dot} />
          <Text style={styles.from}>She replied</Text>
        </View>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.text}>{text}</Text>
        <Text style={styles.dismiss}>tap to dismiss</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingHorizontal: 20,
  },
  bubble: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    gap: 8,
    shadowColor: "#f9a8d4",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1.5,
    borderColor: "#fce7f3",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#f9a8d4",
  },
  from: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "#9b7c8a",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  emoji: {
    fontSize: 36,
  },
  text: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    color: "#1a1a2e",
    textAlign: "center",
  },
  dismiss: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: "#c4a6b4",
    marginTop: 4,
  },
});
