import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "@/app/_components/theme/theme-provider";
import { Toaster } from "@/app/_components/ui/sonner";

export const metadata: Metadata = {
  title: 'My Book Collection',
  description: 'A place to keep track of all the books you own.',
  icons: [{ rel: 'icon', url: '/icon.jpg' }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </TRPCReactProvider>
        <Toaster position="top-center"/>
      </body>
    </html>
  );
}
