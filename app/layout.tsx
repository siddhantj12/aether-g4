import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { PreferencesProvider } from "@/lib/use-preferences"

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Aether',
  description: 'Aether – your matte-dark focus companion',
  generator: 'Aether',
  icons: {
    icon: '/icon.png',
    shortcut: '/favicon.png',
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <PreferencesProvider>
          {children}
          <Analytics />
        </PreferencesProvider>
      </body>
    </html>
  )
}
