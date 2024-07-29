import { getServerAuthSession } from '@/server/auth';
import { Header } from '@/app/_components/header';
import { redirect } from 'next/navigation';
import { GoogleSignIn } from '@/app/_components/google-sign-in';

export default async function SignIn() {
  const session = await getServerAuthSession();

  if (session) {
    redirect('/');
  }

  return (
    <main className='flex min-h-screen w-screen flex-col bg-background'>
      <Header session={session} />
      <div className='flex w-full max-w-96 flex-col items-center justify-center rounded-md bg-background bg-zinc-950 p-8 m-auto'>
        <h1 className='text-lg'>Please Sign In below</h1>
        <GoogleSignIn />
      </div>
    </main>
  );
}
