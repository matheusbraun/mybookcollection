'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/app/_components/ui/button';

export function GoogleSignIn() {
  return (
    <Button
      className='mt-6'
      onClick={() => signIn('google')}
      variant='default'
    >
      Sign In with Google
    </Button>
  );
}