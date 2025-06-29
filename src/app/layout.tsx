import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://vietnam-real-estate.vercel.app'),
  title: {
    default: 'Vietnam Real Estate',
    template: '%s | Vietnam Real Estate',
  },
  description: '베트남 부동산 매물, 인테리어, 법률자문 전문 플랫폼',
  keywords: '베트남, 부동산, 매매, 임대, 호치민, 하노이, 다낭, 아파트, 빌라',
  openGraph: {
    title: 'Vietnam Real Estate - 베트남 부동산',
    description: '베트남 최고의 부동산 매물을 찾아보세요.',
    type: 'website',
    locale: 'ko_KR',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://vietnam-real-estate.vercel.app',
    siteName: 'Vietnam Real Estate',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vietnam Real Estate - 베트남 부동산',
    description: '베트남 최고의 부동산 매물을 찾아보세요.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <footer className="bg-gray-800 text-white py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <p>&copy; 2024 Vietnam Real Estate. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
} 