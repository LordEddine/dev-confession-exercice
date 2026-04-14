"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { error } from "console";
import { revalidatePath } from "next/cache";
import { PackId, CREDIT_PACK } from "@/lib/types";



export async function purchaseCredits(PackId: PackId){
    const clerkUser = await currentUser();

    if(!clerkUser) {
        throw new Error("Vous devez vous connecte pour achetes des credits"); 
    }

    const pack = CREDIT_PACK.find((p) => p.id === PackId)

    if(!pack){
        throw new Error("Erreur de choix de package");
    }


    const result = await prisma.$transaction(async(tx) =>{
        // Recuperation a partir de la table user 
        const user = await tx.user.findUnique({
            where: { clerkId: clerkUser.id}
        });

        if(!user){
            throw new Error("Utilisateur introuvable"); // ROLLBACK automatique
        }

        const payment = await tx.payment.create({
            data: {
                amount : pack.price,
                credits : pack.credits,
                status : "PENDING",
                userId : user.id,
            },
        });

        const paymentSucceeded = true; // toujours a true pour l'exercice stripeResult.status === 'succeeded'

        if(!paymentSucceeded){
            await tx.payment.update({
                where: {id : payment.id},
                data : { status: "FAILED"},
            });
            throw new Error("Le paiement a echoue");
        }

        const updatedUser = await tx.user.update({
            where : {id : user.id},
            data: {
                credits : {increment: pack.credits} // user.credit = user.credit + pack.credit
            },
        });

        await tx.payment.update({
            where:{id : payment.id},
            data:{status: "COMPLETED"},
        });



    });

    revalidatePath("/");

    return result;
}

export async function getUserCredits(){
    const clerkId = await currentUser();

    if(!clerkId){
        return null;
    }

    const user = await prisma.user.findUnique({ // SELECT credit, karma from User where clerkId = user.clerkId
        where: {clerkId : clerkId.id},
        select:{
            credits: true,
            karma: true,
        },
    });

    return user;

}

export async function getPaymentHistory(){
    const clerkId = await currentUser();

    if(!clerkId){
        return null;
    }

    const user = await prisma.user.findUnique({ // SELECT credit, karma from User where clerkId = user.clerkId
        where: {clerkId : clerkId.id},
    });

    if(!user){
        return [];
    }

    const payments = await prisma.payment.findMany({
        where: {userId : user.id},
        orderBy : {createdAt: "desc"},
    });
    return payments;
}