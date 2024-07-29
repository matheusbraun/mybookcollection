'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from './data-table-column-header';
import { Button } from '../ui/button';
import { PencilIcon } from 'lucide-react';
import { categories } from '@/data/data';
import Link from 'next/link';

export type Book = {
  id: number;
  name: string;
  numberOfVolumes: number;
  category: 'book' | 'manga' | 'manhwa' | 'comic';
  isCompleted: boolean;
};

export const columns: ColumnDef<Book>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const category = categories.find(
        category => category.value === row.getValue('category'),
      );

      if (!category) {
        return null;
      }

      return <span>{category.label}</span>;
    },
    filterFn: (row, id, value) => {
      // eslint-disable-next-line
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'numberOfVolumes',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Volumes" />
    ),
  },
  {
    accessorKey: 'isCompleted',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Completed"
        className="text-center"
      />
    ),
    cell: ({ getValue }) => {
      const isCompleted = getValue() as boolean;
      return isCompleted ? (
        <span className="text-center text-green-500">Yes</span>
      ) : (
        <span className="text-center text-red-500">No</span>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex justify-start space-x-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9"
          title="Edit"
          asChild
        >
          <Link href={`/book/${row.original.id}`}>
            <PencilIcon className="text-primary" />
          </Link>
        </Button>
      </div>
    ),
  },
];

export const columnsShared: ColumnDef<Book>[] = columns.slice(
  0,
  columns.length - 1,
);
