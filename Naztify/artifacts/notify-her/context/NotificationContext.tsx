import React, { createContext, useContext, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type MoodOption = {
  id: string;
  label: string;
  emoji: string;
  message: string;
  replyYes: string;
  replyYesEmoji: string;
  replyNo: string;
  replyNoEmoji: string;
  color: string;
  gradient: [string, string];
};

export const MOOD_OPTIONS: MoodOption[] = [
  {
    id: "thinking",
    label: "Thinking about her",
    emoji: "👀",
    message: "I'm thinking about you 👀",
    replyYes: "im thinking about you too",
    replyYesEmoji: "👀",
    replyNo: "Nemikham",
    replyNoEmoji: "😒",
    color: "#c084fc",
    gradient: ["#e9d5ff", "#c084fc"],
  },
  {
    id: "missing",
    label: "Missing her",
    emoji: "🥺",
    message: "I miss you 🥺",
    replyYes: "i miss u too",
    replyYesEmoji: "🥺",
    replyNo: "Nemikham",
    replyNoEmoji: "😒",
    color: "#f9a8d4",
    gradient: ["#fce7f3", "#f9a8d4"],
  },
  {
    id: "mood",
    label: "Im in the mood",
    emoji: "🫦",
    message: "I'm in the mood 🫦",
    replyYes: "",
    replyYesEmoji: "🫦",
    replyNo: "Nemikham",
    replyNoEmoji: "😒",
    color: "#fb7185",
    gradient: ["#ffe4e6", "#fb7185"],
  },
  {
    id: "sorry",
    label: "Sad & sorry",
    emoji: "☹️",
    message: "I'm sad & sorry ☹️",
    replyYes: "Qose nakhor",
    replyYesEmoji: "🥺",
    replyNo: "Nemikham",
    replyNoEmoji: "😒",
    color: "#60a5fa",
    gradient: ["#dbeafe", "#60a5fa"],
  },
];

type SentItem = {
  id: string;
  moodId: string;
  sentAt: number;
};

type NotificationContextType = {
  sentHistory: SentItem[];
  lastReply: { text: string; emoji: string } | null;
  lastSentMoodId: string | null;
  sendMood: (moodId: string) => Promise<void>;
  clearReply: () => void;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [sentHistory, setSentHistory] = useState<SentItem[]>([]);
  const [lastReply, setLastReply] = useState<{ text: string; emoji: string } | null>(null);
  const [lastSentMoodId, setLastSentMoodId] = useState<string | null>(null);

  const sendMood = useCallback(async (moodId: string) => {
    const item: SentItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      moodId,
      sentAt: Date.now(),
    };

    setLastSentMoodId(moodId);
    setSentHistory((prev) => [item, ...prev.slice(0, 19)]);

    try {
      await AsyncStorage.setItem("lastSentMoodId", moodId);
    } catch (_) {}

    const mood = MOOD_OPTIONS.find((m) => m.id === moodId);
    if (!mood) return;

    const replyAfterMs = 3000 + Math.random() * 5000;
    const shouldReply = Math.random() > 0.3;

    setTimeout(() => {
      if (shouldReply) {
        const useYes = Math.random() > 0.3;
        const replyText = useYes
          ? mood.replyYes
            ? `${mood.replyYes} ${mood.replyYesEmoji}`
            : mood.replyYesEmoji
          : `${mood.replyNo} ${mood.replyNoEmoji}`;
        const replyEmoji = useYes ? mood.replyYesEmoji : mood.replyNoEmoji;
        setLastReply({ text: replyText, emoji: replyEmoji });
      }
    }, replyAfterMs);
  }, [sentHistory]);

  const clearReply = useCallback(() => {
    setLastReply(null);
  }, []);

  return (
    <NotificationContext.Provider value={{ sentHistory, lastReply, lastSentMoodId, sendMood, clearReply }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotification must be used within NotificationProvider");
  return ctx;
}
