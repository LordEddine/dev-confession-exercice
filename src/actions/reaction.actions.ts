"use server";

import  prisma  from "@/lib/prisma";
import { getCurrentUser } from "./user.actions";
import { revalidatePath } from "next/cache";
import { Emoji } from "../generated/prisma/client";

export async function toggleReaction(confessionId: string, emoji: Emoji) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Connectez-vous pour réagir");
  }

  // Vérifier si la réaction existe déjà
  const existingReaction = await prisma.reaction.findUnique({
    where: {
      userId_confessionId_emoji: {
        userId: user.id,
        confessionId,
        emoji,
      },
    },
  });

  if (existingReaction) {
    // Supprimer la réaction
    await prisma.reaction.delete({
      where: { id: existingReaction.id },
    });
  } else {
    // Créer la réaction
    await prisma.reaction.create({
      data: {
        emoji,
        userId: user.id,
        confessionId,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/confessions");
}

export async function getReactionCounts(confessionId: string) {
  const reactions = await prisma.reaction.groupBy({
    by: ["emoji"],
    where: { confessionId },
    _count: {
      emoji: true,
    },
  });

  return reactions.reduce(
    (acc, r) => ({
      ...acc,
      [r.emoji]: r._count.emoji,
    }),
    {} as Record<Emoji, number>
  );
}

// [pomme, pomme, orange, pomme] . reduce ===> { pomme: 3, orange: 1}