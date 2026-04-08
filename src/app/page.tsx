import { Header } from "@/components/Header";
import { getConfessions, getTopConfessions } from "@/actions/confession.actions";
import { ConfessionCard } from "@/components/ConfessionCard";
import { getCurrentUser } from "@/actions/user.actions";
import Link from "next/link";

export default async function HomePage() {
  const [{ confessions }, topConfessions, currentUser] = await Promise.all([
    getConfessions(1, 5),
    getTopConfessions(3),
    getCurrentUser(),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Hero */}
        <section className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              DevConfessions
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Le mur des aveux où les développeurs confessent leurs plus grands
            fails de code. Anonymement. Sans jugement. 🎭
          </p>
          <Link
            href="/new"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition transform hover:scale-105"
          >
            🙏 Confesser mon fail
          </Link>
        </section>

        {/* Top 3 */}
        {topConfessions.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              🏆 Hall of Fame des Fails
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {topConfessions.map((confession, index) => (
                <div key={confession.id} className="relative">
                  <span className="absolute -top-3 -left-3 text-4xl z-10">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                  </span>
                  <ConfessionCard
                    confession={confession as any}
                    currentUserId={currentUser?.id}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Dernières confessions */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              📜 Dernières Confessions
            </h2>
            <Link
              href="/confessions"
              className="text-purple-400 hover:text-purple-300 transition"
            >
              Voir tout →
            </Link>
          </div>
          <div className="space-y-6">
            {confessions.map((confession) => (
              <ConfessionCard
                key={confession.id}
                confession={confession}
                currentUserId={currentUser?.id}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}