"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function syncUser(){
    const clerkUser = await currentUser();

    if(!clerkUser){
        throw new Error("Utilisateur non authentifié");
    }

    const existingUser = await prisma.user.findUnique({
        where : {clerkId: clerkUser.id}
    })

    if (existingUser){
        return existingUser;
    }

    const newUser = await prisma.user.create({
        data: {
            clerkId: clerkUser.id,
            username: clerkUser.username || clerkUser.firstName || "Anonymous",
            imageUrl: clerkUser.imageUrl || null,
        }
    })

}

export async function getCurrentUser(){
    const clerkUser = await currentUser();

    if(!clerkUser){
        return null;
    }

    const existingUser = await prisma.user.findUnique({
        where : {clerkId: clerkUser.id}
    })

    return existingUser;
}

export async function getLeaderboard() {
    // Top confesseurs (plus de confessions)
    const topConfessors = await prisma.user.findMany({
        select: {
            id: true,
            username: true,
            imageUrl: true,
            _count: {
                select: { confessions: true }
            }
        },
        orderBy: {
            confessions: { _count: 'desc' }
        },
        take: 10,
    });

    // Top confessions (plus de réactions)
    const topConfessions = await prisma.confession.findMany({
        select: {
            id: true,
            content: true,
            category: true,
            isAnonymous: true,
            author: {
                select: {
                    username: true,
                    imageUrl: true,
                }
            },
            _count: {
                select: { reactions: true }
            }
        },
        orderBy: {
            reactions: { _count: 'desc' }
        },
        take: 5,
    });

    // Utilisateurs les plus réactifs
    const topReactors = await prisma.user.findMany({
        select: {
            id: true,
            username: true,
            imageUrl: true,
            _count: {
                select: { reactions: true }
            }
        },
        orderBy: {
            reactions: { _count: 'desc' }
        },
        take: 10,
    });

    return {
        topConfessors: topConfessors.filter(u => u._count.confessions > 0),
        topConfessions: topConfessions.filter(c => c._count.reactions > 0),
        topReactors: topReactors.filter(u => u._count.reactions > 0),
    };
}