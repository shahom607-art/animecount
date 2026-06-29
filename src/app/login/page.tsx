'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signIn } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Clock, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await signIn.email({
        email,
        password,
      });

      if (res.error) {
        setError(res.error.message || 'Failed to sign in');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-zinc-100 to-zinc-400 flex items-center justify-center text-zinc-950 font-bold">
              <Clock className="w-5 h-5 stroke-[2.5]" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
          <p className="text-xs text-zinc-400">Enter your credentials to access your anime list</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">{error}</div>}

          <Button type="submit" className="w-full h-11 text-sm font-semibold gap-2" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Log In <ArrowRight className="w-4 h-4" /></>}
          </Button>
        </form>

        <p className="text-center text-xs text-zinc-500">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-zinc-200 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
