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

  const result = await prisma.$transaction(async(tx)=>{
    // Vérifier si la réaction existe déjà
  const existingReaction = await tx.reaction.findUnique({
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
    await tx.reaction.delete({
      where: { id: existingReaction.id },
    });
    await tx.user.update({
      where:{id: user.id},
      data:{
        credits:{increment: 1}
      }
    });

    const confession = await tx.confession.findUnique({
      where:{id : confessionId},
    })

    if(confession && confession.authorId !== user.id){
      await tx.user.update({
        where:{id: confession.authorId},
        data:{
          karma:{decrement:1}
        },
      });
    }

    return { action:"Supprimer une reaction", credit_restant: user.credits };

  } 

  // Creation d'une reaction

  const freshUser = await tx.user.findUnique({
    where:{id: user.id},
  });


  if(!freshUser || freshUser.credits == 0){
    throw new Error("Pas assez de credit ! Veuillez en achete !"); // ROLLBACK
  }

  await tx.reaction.create({
    data:{
      emoji,
      userId : user.id,
      confessionId,
    }
  });

  await tx.user.update({
    where:{id: user.id},
    data:{credits:{decrement:1}},
  })

  const confession = await tx.confession.findUnique({ // SELECT authorId from confession where id = confessionId;
    where:{id : confessionId},
    select : {authorId: true}
  });

  if(confession && confession.authorId !== user.id){
    await tx.user.update({
      where:{id: confession.authorId},
      data:{karma:{increment:1}},
    });
  }

  return { action: "Ajouter Reaction", credit_restant: freshUser.credits};
  });


  revalidatePath("/");
  revalidatePath("/confessions");

  return result;
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