"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser, syncUser } from "./user.actions";
import { Category } from "@/generated/prisma/client";
import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate";

export async function createConfession(formData: FormData){
    const user = await getCurrentUser();

    if(!user){
        await syncUser();
        const newUser = await getCurrentUser();

        if(!newUser){ 
            throw new Error("Utilisateur non authentifié après synchronisation");
        }
    }

    const currentUser = user || (await getCurrentUser());

    const content = formData.get("content") as string;
    const isAnonymous = formData.get("isAnonymous") === "true";
    const category = formData.get("category") as Category;

    if(!content || content.trim().length < 10){
        throw new Error("Le contenu de la confession doit contenir au moins 10 caractères.");
    }

    if(content.trim().length > 500){
        throw new Error("Le contenu de la confession ne peut pas dépasser 500 caractères.");
    }

    await prisma.confession.create({
        data: {
            content: content.trim(),
            isAnonymous,
            category,
            authorId: currentUser!.id,
        }
    })

    revalidatePath("/");
    revalidatePath("/confessions");
}


export async function getConfessions(page: number = 1, limit: number = 5, category?: Category){
    const skip = (page - 1) * limit;

    const where = category ? { category } : {};

    const [confessions, total] = await Promise.all([
        prisma.confession.findMany({
            where,
            include: {
                author: {
                    select: {
                        username: true,
                        imageUrl : true,
                    }
                },
                reactions: {
                    select: {
                        emoji: true, 
                        userId: true,
                    }
                },
                _count: {
                    select: { reactions : true}
                }
            },
            orderBy: {
                createdAt: "desc",
            },
            skip,
            take: limit,
        }),
        prisma.confession.count({where })
    ])
    return {
        confessions, 
        totalPages : Math.ceil(total / limit),
        currentPage: page,
    };
}

export async function getTopConfessions(limit: number = 5) {
  const confessions = await prisma.confession.findMany({
    include: {
      author: {
        select: {
          username: true,
          imageUrl: true,
        },
      },
      reactions: {
        select: {
          emoji: true,
          userId: true,
        },
      },
      _count: {
        select: {
          reactions: true,
        },
      },
    },
    orderBy: {
      reactions: {
        _count: "desc",
      },
    },
    take: limit,
  });

  return confessions;
}

export async function deleteConfession(confessionId: string) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Non autorisé");
  }

  const confession = await prisma.confession.findUnique({
    where: { id: confessionId },
  });

  if (!confession) {
    throw new Error("Confession non trouvée");
  }

  if (confession.authorId !== user.id) {
    throw new Error("Vous ne pouvez supprimer que vos propres confessions");
  }

  await prisma.confession.delete({
    where: { id: confessionId },
  });

  revalidatePath("/");
  revalidatePath("/confessions");
}