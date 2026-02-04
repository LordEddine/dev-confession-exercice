import { Emoji, Category } from "../generated/prisma/client";

export const EMOJI_MAP : Record<Emoji, string> = {
    LAUGH : "😂",
    FACEPALM : "🤦‍♂️",
    SKULL : "💀",
    SALUTE : "🫡",
    FIRE : "🔥",
    HEART : "❤️",
}

export const CATEGORY_MAP : Record<Category, { label: string; icon: string}>= {
    BUG: { label: "Bug" , icon: "🐛" },
    GIT_DISASTER: { label: "Git Disaster" , icon: "💥" },
    PRODUCTION_FAIL: { label: "Production Fail" , icon: "🚨" },
    STACKOVERFLOW: { label: "Stack Overflow" , icon: "🌊" },
    IMPOSTER_SYNDROME: { label: "Imposter Syndrome" , icon: "😰" },
    COFFEE_NEEDED: { label: "Coffee Needed" , icon: "☕" },
}

export type ConfessionWithReactions = {
  id: string;
  content: string;
  isAnonymous: boolean;
  category: Category;
  createdAt: Date;
  author: {
    username: string | null;
    imageUrl: string | null;
  };
  reactions: {
    emoji: Emoji;
    userId: string;
  }[];
  _count: {
    reactions: number;
  };
};