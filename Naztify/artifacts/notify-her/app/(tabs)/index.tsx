import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MoodCard } from "@/components/MoodCard";
import { ReplyBubble } from "@/components/ReplyBubble";
import { SentConfirmation } from "@/components/SentConfirmation";
import { MOOD_OPTIONS, useNotification } from "@/context/NotificationContext";

export default function SendScreen() {
  const insets = useSafeAreaInsets();
  const { sendMood, lastReply, clearReply } = useNotification();
  const [sending, setSending] = useState(false);
  const [sentMoodId, setSentMoodId] = useState<string | null>(null);

  const handleSend = async (moodId: string) => {
    if (sending) return;
    setSending(true);
    setSentMoodId(moodId);
    await sendMood(moodId);
  };

  const handleConfirmationDone = () => {
    setSending(false);
    setSentMoodId(null);
  };

  const sentMood = sentMoodId ? MOOD_OPTIONS.find((m) => m.id === sentMoodId) : null;

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={styles.root}>
      {lastReply && (
        <View style={{ paddingTop: topInset + 12, paddingHorizontal: 20 }}>
          <ReplyBubble
            text={lastReply.text}
            emoji={lastReply.emoji}
            onDismiss={clearReply}
          />
        </View>
      )}

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: lastReply ? topInset + 130 : topInset + 30,
            paddingBottom: bottomInset + 80,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.heartEmoji}>💌</Text>
          <Text style={styles.title}>Hey babe</Text>
          <Text style={styles.subtitle}>what's on your mind?</Text>
        </View>

        <View style={styles.grid}>
          {MOOD_OPTIONS.map((mood) => (
            <MoodCard
              key={mood.id}
              mood={mood}
              onPress={() => handleSend(mood.id)}
              disabled={sending}
            />
          ))}
        </View>

        <Text style={styles.hint}>She'll get a notification instantly</Text>
      </ScrollView>

      {sentMood && (
        <SentConfirmation mood={sentMood} onDone={handleConfirmationDone} />
      )}
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
    marginBottom: 32,
    gap: 6,
  },
  heartEmoji: {
    fontSize: 44,
    marginBottom: 4,
  },
  title: {
    fontSize: 30,
    fontFamily: "Inter_700Bold",
    color: "#1a1a2e",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: "#9b7c8a",
    letterSpacing: 0.2,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  hint: {
    marginTop: 28,
    textAlign: "center",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "#c4a6b4",
    letterSpacing: 0.3,
  },
});
