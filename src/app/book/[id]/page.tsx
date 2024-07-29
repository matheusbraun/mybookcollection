import { Header } from '@/app/_components/header';
import { BookForm } from '@/app/_components/book-form';
import { getServerAuthSession } from '@/server/auth';
import { HydrateClient, api } from '@/trpc/server';
import { redirect } from 'next/navigation';

export default async function Edit({ params }: { params: { id: string } }) {
  const session = await getServerAuthSession();

  if (!session) {
    return redirect('/signin');
  }

  const data = await api.book.getBookById({ id: Number(params.id) });

  if (!data) {
    return redirect('/book/new');
  }

  return (
    <HydrateClient>
      <main className="mx-auto flex min-h-screen w-screen max-w-[1480px] flex-col bg-background">
        <Header session={session} />
        <div className="mt-4 rounded-[0.5rem] border bg-background shadow">
          <div className="container h-full w-full flex-col space-y-8 p-8">
            <h2 className="text-2xl font-bold">Edit book</h2>
            <BookForm session={session} isEdit={true} bookId={params.id} book={{
              name: data.name,
              category: data.category,
              numberOfVolumes: data.numberOfVolumes,
              isCompleted: data.isCompleted ? 'yes' : 'no',
            }} />
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
