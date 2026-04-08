import { Header } from "@/components/Header";
import { ConfessionCard } from "@/components/ConfessionCard";
import { CATEGORY_MAP } from "@/lib/types";
import { getCurrentUser } from "@/actions/user.actions";
import { Category } from "@/generated/prisma/client";
import { getConfessions } from "@/actions/confession.actions";

import Link from "next/link";

type Props = {
    searchParams : Promise<{category?: Category, page?: string}>;
}

export default async function ConfessionsPage({searchParams} : Props){
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const category = params.category;

    const [{ confessions, totalPages , currentPage}, currentUser] = await Promise.all(
        [getConfessions(page, 2, category), getCurrentUser()],
    )

    return(
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
            <Header />

            <main className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold mb-8 text-gray-100">Toutes les Confessions</h1>
            </main>

            <div className="flex flex-wrap gap-2 mb-8">
                <Link href="/confessions"
                        className={`px-4 py-2 rounded-full text-sm transition ${
                        !category ? "bg-purple-600 text-white" 
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}>
                    Toutes
                </Link>
                {Object.entries(CATEGORY_MAP).map(([key, {label, icon} ])=>(
                    <Link
                    key={key}
                    href={`/confessions?category=${key}`}
                    className={`px-4 py-2 rounded-full text-sm transition ${
                        category === key ? "bg-purple-600 text-white" 
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}>
                        {icon} {label}
                    </Link>
                ))}
            </div>
                
            {/*Recuperer la liste des confessions*/}
            {confessions.length === 0 ? (
                <p className="text-gray-400">Aucune confession trouvée.</p>

            ): (
                confessions.map((confession)=>(
                    <ConfessionCard 
                    key={confession.id}
                    confession={confession}
                    currentUserId={currentUser?.id}
                    />
                ))
            )
            }
            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-12">
                    {Array.from({length : totalPages}, (_, i) => i + 1).map((p)=>(
                        <Link 
                        key={p}
                        href={`/confessions?page=${p}${category ? `&category=${category}` : ''}`}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg transition ${
                                p === currentPage
                                ? "bg-purple-600 text-white"
                                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                            }`}
                        >
                            {p}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}



