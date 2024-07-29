'use client';

import { Button } from '../ui/button';
import { type Session } from 'next-auth';
import { Share2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export function DataTableTopSection({
  session,
  numberOfVolumes,
  isShared,
  user,
}: {
  session: Session | null;
  numberOfVolumes: number;
  isShared?: boolean;
  user?: { name: string | null };
}) {
  async function onShareClick() {
    if (typeof window === 'undefined') {
      toast.error('Clipboard not working', {
        description: "Didn't copy the url. Please try again.",
        duration: 3000,
      });
      return;
    }

    const url = `${window.location.origin}/share/${session?.user?.id}`;

    await navigator.clipboard.writeText(url);

    toast.success('Share url successfully copied', {
      description: `${url} successfully copied to your clipboard.`,
      duration: 3000,
    });
  }

  const name = session ? session.user?.name : user?.name;

  return (
    <div className="flex items-center justify-between space-y-2">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          {name}&apos;s Book Collection - {numberOfVolumes}{' '}
          volumes
        </h2>
        {!isShared && (
          <p className="flex items-center gap-2 text-muted-foreground">
            Share your collection with others{' '}
            <Share2
              className="h-4 w-4 cursor-pointer text-primary"
              onClick={onShareClick}
            />
          </p>
        )}
      </div>
      {!isShared && (
        <Button variant="default" asChild>
          <Link href="/book/new">Add a new book</Link>
        </Button>
      )}
    </div>
  );
}
