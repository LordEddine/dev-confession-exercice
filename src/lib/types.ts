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

export const CREDIT_PACK = [
    {id:"pack_10",credits:10,price:0.99,label:"10 credits",popular:false},
    {id:"pack_50",credits:50,price:3.99,label:"50 credits",popular:true},
    {id:"pack_100",credits:100,price:6.99,label:"100 credits",popular:false},
    {id:"pack_500",credits:500,price:29.99,label:"500 credits",popular:false},
] as const;

export type PackId = typeof CREDIT_PACK[number]["id"];