import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { ReactQueryClientProvider } from '@/service/ReactQueryClientProvider';
import ParentProvider from './ParentWrapper';
import Snackbar from '@/components/SnackBar/SnackBar';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Duo Study',
  description: 'Generated by create next app for match study',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ReactQueryClientProvider>
      <ParentProvider>
        <html lang="en">
          <body className={inter.className}>
            {children}
            <Snackbar />
          </body>
        </html>
      </ParentProvider>
    </ReactQueryClientProvider>
  )
}
