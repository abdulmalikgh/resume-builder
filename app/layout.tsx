import type { Metadata } from 'next'
import { inter, roboto, playfair } from '@/lib/fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'Resume Builder',
  description: 'Create professional resumes with ease',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto.variable} ${playfair.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
