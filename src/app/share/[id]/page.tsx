import { Header } from '@/app/_components/header';
import { getServerAuthSession } from '@/server/auth';
import { HydrateClient, api } from '@/trpc/server';
import { DataTableTopSection } from '@/app/_components/books/data-table-top-section';
import { DataTable } from '@/app/_components/books/data-table';
import { columnsShared } from '@/app/_components/books/columns';

export default async function Edit({ params }: { params: { id: string } }) {
  const session = await getServerAuthSession();

  const data = await api.book.getAllShared({ userId: params.id });
  const user = await api.user.getUserById({ userId: params.id });

  const numberOfVolumes = data.reduce((acc, book) => {
    return acc + book.numberOfVolumes;
  }, 0);

  return (
    <HydrateClient>
      <main className="mx-auto flex min-h-screen w-screen max-w-[1480px] flex-col bg-background">
        <Header session={session} />
        <div className="mt-4 rounded-[0.5rem] border bg-background shadow">
          <div className="container h-full w-full flex-col space-y-8 p-8">
            <DataTableTopSection session={session} numberOfVolumes={numberOfVolumes} isShared={true} user={user} />
            <DataTable columns={columnsShared} data={data} />
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
