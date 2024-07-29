'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Button } from './ui/button';
import { Session } from 'next-auth';
import { api } from '@/trpc/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(3, { message: 'Name must be at least 3 characters long' }),
  category: z.enum(['comic', 'book', 'manga', 'manhwa'], {
    required_error: 'Category is required',
  }),
  numberOfVolumes: z.coerce
    .number()
    .min(1, { message: 'Number of volumes must be at least 1' }),
  isCompleted: z.string({ required_error: 'Completed is required' }),
});

export type Book = z.infer<typeof formSchema>;

type BookFormProps = {
  session: Session | null;
  book?: Book;
  isEdit?: boolean;
  bookId?: string;
};

export function BookForm({ session, book, isEdit, bookId }: BookFormProps) {
  const router = useRouter();

  const form = useForm<Book>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: book?.name ?? '',
      category: book?.category ?? undefined,
      numberOfVolumes: book?.numberOfVolumes ?? 0,
      isCompleted: book?.isCompleted ?? undefined,
    },
  });

  const { mutateAsync: createBook, isPending: isCreatePending } = api.book.create.useMutation({
    onSuccess: async () => {
      toast.success('Book created successfully');
      form.setValue('name', '');
      form.setValue('category', 'book');
      form.setValue('numberOfVolumes', 0);
      form.setValue('isCompleted', 'no');
      router.refresh();
    },
  });

  const { mutateAsync: updateBook, isPending: isUpdatePending } = api.book.update.useMutation({
    onSuccess: async () => {
      router.refresh();
      toast.success('Book updated successfully');
    },
  });

  async function onSubmit(values: Book) {
    if (isCreatePending || isUpdatePending) {
      return;
    }

    if (isEdit) {
      await updateBook({
        id: Number(bookId),
        ...values,
        isCompleted: values.isCompleted === 'yes',
        numberOfVolumes: Number(values.numberOfVolumes),
      });

      return;
    }

    await createBook({
      ...values,
      isCompleted: values.isCompleted === 'yes',
      numberOfVolumes: Number(values.numberOfVolumes),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/4 space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Book name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a book category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="book">Book</SelectItem>
                  <SelectItem value="comic">Comic</SelectItem>
                  <SelectItem value="manga">Manga</SelectItem>
                  <SelectItem value="manhwa">Manhwa</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="numberOfVolumes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Volumes</FormLabel>
              <FormControl>
                <Input placeholder="Volumes" {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isCompleted"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Completed</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select the book completion status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-start gap-3">
          <Button type="submit">Submit</Button>
          <Button type="button" variant='outline' onClick={() => router.push("/")}>Go Back</Button>
        </div>
      </form>
    </Form>
  );
}
