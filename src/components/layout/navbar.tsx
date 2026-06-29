'use client';

import Link from 'next/link';
import { useSession, signOut } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { User, Settings, LogOut, Clock, Command } from 'lucide-react';

export function Navbar({ onOpenSearch }: { onOpenSearch?: () => void }) {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-zinc-950/70 border-b border-zinc-800/50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-zinc-100 to-zinc-400 flex items-center justify-center text-zinc-950 font-bold text-lg group-hover:scale-105 transition-transform">
            <Clock className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="font-semibold text-lg tracking-tight text-zinc-100">AnimeCount</span>
        </Link>

        <div className="flex items-center gap-3">
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-all cursor-pointer"
            >
              <Command className="w-3.5 h-3.5" />
              <span>Search anime...</span>
              <kbd className="ml-2 px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-zinc-400">⌘K</kbd>
            </button>
          )}

          {session ? (
            <div className="flex items-center gap-2">
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{session.user.name || 'Profile'}</span>
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <Settings className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 text-zinc-400 hover:text-red-400"
                onClick={() => signOut()}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button variant="default" size="sm">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
