import { getServerAuthSession } from "@/server/auth";
import { HydrateClient, api } from "@/trpc/server";
import { Header } from "@/app/_components/header";
import { redirect } from "next/navigation";
import { DataTableTopSection } from "./_components/books/data-table-top-section";
import { DataTable } from "./_components/books/data-table";
import { columns } from "./_components/books/columns";

export default async function Home() {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/signin");
  }

  const data = await api.book.getAll();

  const numberOfVolumes = data.reduce((acc, book) => {
    return acc + book.numberOfVolumes;
  }, 0);

  return (
    <HydrateClient>
      <main className="mx-auto flex min-h-screen w-screen max-w-[1480px] flex-col bg-background">
        <Header session={session} />
        <div className="mt-4 rounded-[0.5rem] border bg-background shadow">
          <div className="container h-full w-full flex-col space-y-8 p-8">
            <DataTableTopSection session={session} numberOfVolumes={numberOfVolumes} />
            <DataTable columns={columns} data={data} />
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
