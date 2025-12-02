import type { Metadata } from 'next'
import { Lora, Playfair_Display } from 'next/font/google'
import './globals.css'

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Nagma-e-AI - AI Songwriting Companion',
  description: 'Your intelligent assistant for creating, analyzing, and perfecting song lyrics with AI. Features emotion analysis, song structure suggestions, and rhyme pattern visualization.',
  keywords: ['songwriting', 'AI', 'lyrics', 'music', 'emotion analysis', 'rhyme', 'song structure', 'nagma'],
  authors: [{ name: 'Nagma-e-AI' }],
  openGraph: {
    title: 'Nagma-e-AI - AI Songwriting Companion',
    description: 'Create amazing songs with AI-powered assistance',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${lora.variable} ${playfair.variable} font-sans`}>
        {children}
      </body>
    </html>
  )
}