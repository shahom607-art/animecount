'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Key, Trash2, Moon, Sun, Monitor } from 'lucide-react';
import { useSession, signOut } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/theme-provider';

export default function SettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  if (!session) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-zinc-400">Please log in to view settings.</p>
          <Button onClick={() => router.push('/login')}>Log In</Button>
        </div>
      </div>
    );
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Password changed successfully (Demo Mode)');
    setCurrentPassword('');
    setNewPassword('');
  };

  const themeOptions: { value: 'dark' | 'light'; label: string; icon: React.ReactNode }[] = [
    { value: 'dark', label: 'Dark Mode', icon: <Moon className="w-4 h-4" /> },
    { value: 'light', label: 'Light Mode', icon: <Sun className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-12 space-y-10">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Account Settings</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage your preferences, security, and account details.</p>
        </div>

        {/* Theme Preferences */}
        <section className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Moon className="w-5 h-5 text-zinc-400" /> Appearance Theme
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {themeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                className={`flex items-center justify-center gap-2 p-3 rounded-2xl font-medium border transition-all ${
                  theme === opt.value
                    ? 'bg-zinc-800 text-white border-zinc-700 shadow-md'
                    : 'bg-zinc-900/60 text-zinc-400 border-zinc-800/60 hover:text-white hover:border-zinc-700'
                }`}
              >
                {opt.icon} {opt.label}
              </button>
            ))}
          </div>
        </section>

        {/* Change Password */}
        <section className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-zinc-400" /> Change Password
          </h2>

          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                Current Password
              </label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                New Password
              </label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            {message && <p className="text-xs text-emerald-400 font-medium">{message}</p>}

            <Button type="submit" variant="secondary" size="sm">
              Update Password
            </Button>
          </form>
        </section>

        {/* Danger Zone */}
        <section className="p-6 rounded-3xl bg-red-500/5 border border-red-500/20 space-y-4">
          <h2 className="text-lg font-bold text-red-400 flex items-center gap-2">
            <Trash2 className="w-5 h-5" /> Danger Zone
          </h2>
          <p className="text-xs text-zinc-400">
            Deleting your account will permanently wipe all your watched anime history and statistics. This action cannot be undone.
          </p>
          <Button variant="danger" size="sm" onClick={() => signOut()}>
            Delete Account
          </Button>
        </section>
      </main>
    </div>
  );
}
