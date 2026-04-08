import { Header } from "@/components/Header";
import { getLeaderboard } from "@/actions/user.actions";
import { CATEGORY_MAP } from "@/lib/types";
import Image from "next/image";

export default async function LeaderboardPage() {
    const { topConfessors, topConfessions, topReactors } = await getLeaderboard();

    const medals = ["🥇", "🥈", "🥉"];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
            <Header />

            <main className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold mb-2 text-center">
                    <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                        🏆 Hall of Fame
                    </span>
                </h1>
                <p className="text-gray-400 text-center mb-12">Les légendes de DevConfessions</p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Top Confesseurs */}
                    <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span>🎭</span>
                            <span className="text-purple-400">Top Confesseurs</span>
                        </h2>
                        
                        {topConfessors.length === 0 ? (
                            <p className="text-gray-500 text-sm">Aucun confesseur pour le moment</p>
                        ) : (
                            <ul className="space-y-4">
                                {topConfessors.map((user, index) => (
                                    <li key={user.id} className="flex items-center gap-3">
                                        <span className="text-2xl w-8">
                                            {medals[index] || `#${index + 1}`}
                                        </span>
                                        {user.imageUrl ? (
                                            <Image
                                                src={user.imageUrl}
                                                alt={user.username || "User"}
                                                width={40}
                                                height={40}
                                                className="rounded-full"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                                {user.username?.charAt(0).toUpperCase() || "?"}
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <p className="text-gray-200 font-medium">
                                                {user.username || "Anonyme"}
                                            </p>
                                            <p className="text-gray-500 text-sm">
                                                {user._count.confessions} confession{user._count.confessions > 1 ? "s" : ""}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Top Réacteurs */}
                    <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span>⚡</span>
                            <span className="text-pink-400">Top Réacteurs</span>
                        </h2>
                        
                        {topReactors.length === 0 ? (
                            <p className="text-gray-500 text-sm">Aucune réaction pour le moment</p>
                        ) : (
                            <ul className="space-y-4">
                                {topReactors.map((user, index) => (
                                    <li key={user.id} className="flex items-center gap-3">
                                        <span className="text-2xl w-8">
                                            {medals[index] || `#${index + 1}`}
                                        </span>
                                        {user.imageUrl ? (
                                            <Image
                                                src={user.imageUrl}
                                                alt={user.username || "User"}
                                                width={40}
                                                height={40}
                                                className="rounded-full"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                                                {user.username?.charAt(0).toUpperCase() || "?"}
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <p className="text-gray-200 font-medium">
                                                {user.username || "Anonyme"}
                                            </p>
                                            <p className="text-gray-500 text-sm">
                                                {user._count.reactions} réaction{user._count.reactions > 1 ? "s" : ""}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Top Confessions */}
                    <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 md:col-span-2 lg:col-span-1">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span>🔥</span>
                            <span className="text-orange-400">Confessions Populaires</span>
                        </h2>
                        
                        {topConfessions.length === 0 ? (
                            <p className="text-gray-500 text-sm">Aucune confession populaire pour le moment</p>
                        ) : (
                            <ul className="space-y-4">
                                {topConfessions.map((confession, index) => {
                                    const category = CATEGORY_MAP[confession.category];
                                    return (
                                        <li key={confession.id} className="bg-gray-900/50 rounded-lg p-4">
                                            <div className="flex items-start gap-2 mb-2">
                                                <span className="text-xl">{medals[index] || `#${index + 1}`}</span>
                                                <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">
                                                    {category.icon} {category.label}
                                                </span>
                                            </div>
                                            <p className="text-gray-300 text-sm line-clamp-2 mb-2">
                                                &ldquo;{confession.content}&rdquo;
                                            </p>
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <span>
                                                    par {confession.isAnonymous ? "Anonyme" : confession.author.username}
                                                </span>
                                                <span className="text-pink-400">
                                                    ❤️ {confession._count.reactions} réaction{confession._count.reactions > 1 ? "s" : ""}
                                                </span>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}