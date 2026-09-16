import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Bilingual Stamp Maker',
  description: 'Design, customize, and export interactive bilingual rubber stamps with realistic vintage ink distress and high-resolution vector export.',
  openGraph: {
    title: 'Bilingual Stamp Maker',
    description: 'Design, customize, and export interactive bilingual rubber stamps with realistic vintage ink distress and high-resolution vector export.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bilingual Stamp Maker',
    description: 'Design, customize, and export interactive bilingual rubber stamps with realistic vintage ink distress and high-resolution vector export.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
