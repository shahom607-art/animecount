import React from 'react';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getUserStatistics } from '@/services/statsService';
import { ProfileClient } from './profile-client';

export const revalidate = 0;

export default async function ProfilePage() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  if (!session || !session.user) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  const watchEntries = await prisma.watchEntry.findMany({
    where: { userId: session.user.id },
    include: { anime: true },
    orderBy: { updatedAt: 'desc' },
  });

  const stats = await getUserStatistics(session.user.id);

  return <ProfileClient user={user || session.user} entries={watchEntries} stats={stats} />;
}
