import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-3xl">🎭</span>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            DevConfessions
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/confessions"
            className="text-gray-300 hover:text-white transition"
          >
            Confessions
          </Link>
          <Link
            href="/leaderboard"
            className="text-gray-300 hover:text-white transition"
          >
            🏆 Top
          </Link>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition">
                Se connecter
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Link
              href="/new"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg transition"
            >
              + Confesser
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </nav>
      </div>
    </header>
  );
}