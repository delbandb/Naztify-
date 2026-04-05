import React, { useState, useRef, useEffect } from "react";
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { MOOD_OPTIONS, useNotification } from "@/context/NotificationContext";

type ReplyState = {
  moodId: string;
  reply: string;
};

function NotificationCard({ mood, onReply, replied }: {
  mood: typeof MOOD_OPTIONS[0];
  onReply: (text: string) => void;
  replied?: string;
}) {
  const slideIn = useRef(new Animated.Value(-20)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.spring(slideIn, { toValue: 0, useNativeDriver: true, tension: 100, friction: 9 }),
    ]).start();
  }, []);

  const handleReply = (text: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onReply(text);
  };

  const yesLabel = mood.replyYes
    ? `${mood.replyYes} ${mood.replyYesEmoji}`
    : mood.replyYesEmoji;
  const noLabel = `${mood.replyNo} ${mood.replyNoEmoji}`;

  return (
    <Animated.View style={[styles.notification, { opacity, transform: [{ translateY: slideIn }] }]}>
      <View style={styles.notifHeader}>
        <View style={[styles.appIcon, { backgroundColor: mood.color }]}>
          <Text style={styles.appIconEmoji}>{mood.emoji}</Text>
        </View>
        <View style={styles.notifMeta}>
          <Text style={styles.appName}>Naztify</Text>
          <Text style={styles.notifTime}>now</Text>
        </View>
      </View>

      <View style={styles.notifBody}>
        <Text style={styles.notifTitle}>{mood.message}</Text>
        <Text style={styles.notifSub}>What do you want to say back?</Text>
      </View>

      {replied ? (
        <View style={[styles.repliedBadge, { backgroundColor: mood.color + "18", borderColor: mood.color + "44" }]}>
          <Text style={[styles.repliedText, { color: mood.color }]}>You replied: {replied}</Text>
        </View>
      ) : (
        <View style={styles.replyButtons}>
          <Pressable
            style={({ pressed }) => [
              styles.replyBtn,
              styles.replyBtnYes,
              { borderColor: mood.color, backgroundColor: pressed ? mood.color + "22" : mood.color + "12" },
            ]}
            onPress={() => handleReply(yesLabel)}
          >
            <Text style={[styles.replyBtnText, { color: mood.color }]}>{yesLabel}</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.replyBtn,
              styles.replyBtnNo,
              { backgroundColor: pressed ? "#f1f5f9" : "#f8fafc" },
            ]}
            onPress={() => handleReply(noLabel)}
          >
            <Text style={styles.replyBtnNoText}>{noLabel}</Text>
          </Pressable>
        </View>
      )}
    </Animated.View>
  );
}

export default function HerViewScreen() {
  const insets = useSafeAreaInsets();
  const { lastSentMoodId } = useNotification();
  const [replies, setReplies] = useState<Record<string, string>>({});
  const [previewMoodId, setPreviewMoodId] = useState<string>(
    lastSentMoodId ?? MOOD_OPTIONS[0].id
  );

  useEffect(() => {
    if (lastSentMoodId) setPreviewMoodId(lastSentMoodId);
  }, [lastSentMoodId]);

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  const handleReply = (moodId: string, text: string) => {
    setReplies((prev) => ({ ...prev, [moodId]: text }));
  };

  const mood = MOOD_OPTIONS.find((m) => m.id === previewMoodId) ?? MOOD_OPTIONS[0];

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: topInset + 24, paddingBottom: bottomInset + 80 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.phoneEmoji}>📱</Text>
          <Text style={styles.title}>Her Phone</Text>
          <Text style={styles.subtitle}>this is what she sees</Text>
        </View>

        <View style={styles.phoneFrame}>
          <View style={styles.phoneScreen}>
            <View style={styles.statusBar}>
              <Text style={styles.statusTime}>9:41</Text>
              <View style={styles.statusIcons}>
                <Text style={styles.statusIcon}>●●●</Text>
              </View>
            </View>

            <View style={styles.lockScreenContent}>
              <Text style={styles.lockTime}>9:41</Text>
              <Text style={styles.lockDate}>Saturday, April 4</Text>
            </View>

            <NotificationCard
              key={previewMoodId + (replies[previewMoodId] ?? "")}
              mood={mood}
              onReply={(text) => handleReply(previewMoodId, text)}
              replied={replies[previewMoodId]}
            />
          </View>
        </View>

        <Text style={styles.sectionLabel}>Preview a different mood</Text>

        <View style={styles.moodPicker}>
          {MOOD_OPTIONS.map((m) => (
            <Pressable
              key={m.id}
              onPress={() => {
                Haptics.selectionAsync();
                setPreviewMoodId(m.id);
              }}
              style={[
                styles.moodChip,
                {
                  backgroundColor: previewMoodId === m.id ? m.color : m.color + "18",
                  borderColor: m.color + "55",
                },
              ]}
            >
              <Text style={styles.moodChipEmoji}>{m.emoji}</Text>
              <Text style={[
                styles.moodChipLabel,
                { color: previewMoodId === m.id ? "#fff" : "#1a1a2e" },
              ]}>
                {m.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.footerNote}>
          In the real app, she gets an iOS push notification with these exact reply buttons
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff5f8",
  },
  scroll: {
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 28,
    gap: 4,
  },
  phoneEmoji: {
    fontSize: 40,
    marginBottom: 6,
  },
  title: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    color: "#1a1a2e",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#9b7c8a",
  },
  phoneFrame: {
    borderRadius: 40,
    backgroundColor: "#1a1a2e",
    padding: 10,
    shadowColor: "#1a1a2e",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 12,
    marginBottom: 28,
  },
  phoneScreen: {
    backgroundColor: "#f0f4ff",
    borderRadius: 32,
    overflow: "hidden",
    minHeight: 340,
  },
  statusBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 4,
  },
  statusTime: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: "#1a1a2e",
  },
  statusIcons: {},
  statusIcon: {
    fontSize: 8,
    color: "#1a1a2e",
    letterSpacing: 2,
  },
  lockScreenContent: {
    alignItems: "center",
    paddingVertical: 16,
  },
  lockTime: {
    fontSize: 52,
    fontFamily: "Inter_700Bold",
    color: "#1a1a2e",
    lineHeight: 56,
  },
  lockDate: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#555e7a",
  },
  notification: {
    marginHorizontal: 10,
    marginBottom: 12,
    backgroundColor: "rgba(255,255,255,0.88)",
    borderRadius: 18,
    padding: 14,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  notifHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  appIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  appIconEmoji: {
    fontSize: 16,
  },
  notifMeta: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  appName: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: "#555e7a",
    letterSpacing: 0.2,
  },
  notifTime: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: "#9b7c8a",
  },
  notifBody: {
    gap: 2,
  },
  notifTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: "#1a1a2e",
  },
  notifSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "#6b7280",
  },
  replyButtons: {
    flexDirection: "row",
    gap: 8,
  },
  replyBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  replyBtnYes: {},
  replyBtnNo: {
    borderColor: "#e2e8f0",
  },
  replyBtnText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
  replyBtnNoText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: "#64748b",
    textAlign: "center",
  },
  repliedBadge: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    alignItems: "center",
  },
  repliedText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  sectionLabel: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: "#9b7c8a",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  moodPicker: {
    gap: 8,
    marginBottom: 24,
  },
  moodChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  moodChipEmoji: {
    fontSize: 18,
  },
  moodChipLabel: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  footerNote: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "#c4a6b4",
    lineHeight: 18,
    paddingHorizontal: 10,
  },
});
