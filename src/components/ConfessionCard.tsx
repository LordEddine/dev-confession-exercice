"use client";

import { useState } from "react";
import { toggleReaction } from "@/actions/reaction.actions";
import { CATEGORY_MAP, EMOJI_MAP, ConfessionWithReactions } from "@/lib/types";
import { Emoji } from "../generated/prisma/client";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

type Props = {
  confession: ConfessionWithReactions;
  currentUserId?: string;
};

export function ConfessionCard({ confession, currentUserId }: Props) {
  const [isReacting, setIsReacting] = useState(false);

  const categoryInfo = CATEGORY_MAP[confession.category];

  // Compter les réactions par emoji
  const reactionCounts = confession.reactions.reduce((acc, r) => {
    acc[r.emoji] = (acc[r.emoji] || 0) + 1;
    return acc;
  }, {} as Record<Emoji, number>);

  // Vérifier si l'utilisateur a réagi
  const userReactions = confession.reactions
    .filter((r) => r.userId === currentUserId)
    .map((r) => r.emoji);

  async function handleReaction(emoji: Emoji) {
    if (!currentUserId) {
      alert("Connectez-vous pour réagir !");
      return;
    }
    setIsReacting(true);
    try {
      await toggleReaction(confession.id, emoji);
    } catch (error) {
      console.error(error);
    } finally {
      setIsReacting(false);
    }
  }



  function partageSurTwitter(){
    /*
    confession content = Hello World omcioprnwaocmroigbawpv|mcwprwp =>  "|"" on arrive a maxLength => 
    */
    const maxLength = 200;
    const truncatedContent = confession.content.length > maxLength ? 
      confession.content.substring(0, maxLength) + "..." : confession.content;

    const tweetText = `🎭 Confession de dev:\n\n${truncatedContent}\n\n${categoryInfo.icon} #DevConfession #DevFail`;

    const tweetIntentUrl = "https://twitter.com/intent/tweet";

    const encodedText = encodeURIComponent(tweetText);

    const url = `${tweetIntentUrl}?text=${encodedText}`;

    window.open(url,"_blank","noopener,noreferrer,width=550,height=420");
  }

  return (
    <article className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{categoryInfo.icon}</span>
          <span className="text-sm text-purple-400">{categoryInfo.label}</span>
        </div>
        <time className="text-xs text-gray-500">
          {formatDistanceToNow(new Date(confession.createdAt), {
            addSuffix: true,
            locale: fr,
          })}
        </time>
      </div>

      {/* Contenu */}
      <p className="text-gray-100 text-lg leading-relaxed mb-4">
        "{confession.content}"
      </p>

      {/* Auteur */}
      <div className="flex items-center gap-2 mb-4 text-sm text-gray-400">
        {confession.isAnonymous ? (
          <>
            <span className="text-xl">🎭</span>
            <span>Dev Anonyme</span>
          </>
        ) : (
          <>
            {confession.author.imageUrl && (
              <img
                src={confession.author.imageUrl}
                alt=""
                className="w-6 h-6 rounded-full"
              />
            )}
            <span>{confession.author.username}</span>
          </>
        )}
      </div>

      {/* Réactions */}
      <div className="flex items-center gap-2 flex-wrap">
        {(Object.keys(EMOJI_MAP) as Emoji[]).map((emoji) => {
          const count = reactionCounts[emoji] || 0;
          const hasReacted = userReactions.includes(emoji);

          return (
            <button
              key={emoji}
              onClick={() => handleReaction(emoji)}
              disabled={isReacting}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition ${
                hasReacted
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 hover:bg-gray-600 text-gray-300"
              } disabled:opacity-50`}
            >
              <span>{EMOJI_MAP[emoji]}</span>
              {count > 0 && <span>{count}</span>}
            </button>
          );
        })}


        {/* Bouton Partager sur Twitter/X */}
        <button
          onClick={partageSurTwitter}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-gray-700 hover:bg-[#1DA1F2] text-gray-300 hover:text-white transition ml-auto"
          title="Partager sur X/Twitter"
        >
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span className="hidden sm:inline">Partager</span>
        </button>





      </div>
    </article>
  );
}