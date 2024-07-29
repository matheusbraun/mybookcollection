'use client';

import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import type { Session } from 'next-auth';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { LogOutIcon } from 'lucide-react';
import { Button } from './ui/button';
import { ThemeToggle } from './theme/theme-toggle';

export async function Header({ session }: { session: Session | null }) {
  const pathName = usePathname();

  const isShareRoute = pathName.includes('share');

  const getNameFirstTwoInitials = (name: string) => {
    const nameArray = name.split(' ');

    if (nameArray.length >= 2) {
      return nameArray?.[0]?.charAt(0) ?? '' + nameArray?.[1]?.charAt(0) ?? '';
    }

    return 'ND';
  };

  return (
    <header
      className={cn(
        'mx-auto mt-4 flex h-20 w-full max-w-[1480px] items-center px-6 justify-between'
      )}
    >
      <Link href='/' title='Go to home'>
        <p className='w-64 text-2xl font-bold leading-9 tracking-tight hover:cursor-pointer'>
          mybookcollection
          <span className='ml-1 text-primary'>.</span>
        </p>
      </Link>
      {session ? (
        <div className='ml-auto flex items-center'>
          <div className='mr-4 text-right'>
            <p>{session.user?.name}</p>
            <p className='text-sm text-muted-foreground'>{session.user?.email}</p>
          </div>
          <Avatar>
            <AvatarImage src={session.user?.image ?? undefined} />
            <AvatarFallback>
              {getNameFirstTwoInitials(session.user?.name ?? '')}
            </AvatarFallback>
          </Avatar>
          <LogOutIcon
            className='ml-8 cursor-pointer text-lg text-primary'
            onClick={() => signOut()}
          />
        </div>
      ) : null}
      {!session && isShareRoute ? (
        <Button asChild>
          <Link href='/signin'>Sign In</Link>
        </Button>
      ) : null}
      <div className='ml-3'>
        <ThemeToggle />
      </div>
    </header>
  );
}
