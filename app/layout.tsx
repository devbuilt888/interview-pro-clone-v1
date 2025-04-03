import './globals.css'
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react';
import { Space_Grotesk } from 'next/font/google';
import ServiceWorkerRegistry from './components/ServiceWorkerRegistry';

// Initialize the Space Grotesk font
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'InterviewPro - AI-Powered Interview Training',
  description: 'Practice behavioral interviews with our AI-powered interviewer. Get real-time feedback and improve your interview skills.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body className={spaceGrotesk.className}>
        {/* Register service worker for PDF.js worker caching */}
        <ServiceWorkerRegistry />
        {children}
        <Analytics />
      </body>
    </html>
  )
}