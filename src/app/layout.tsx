import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import AuthButton from './components/AuthButton'
import { headers } from 'next/headers'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Smart Bookmark | Abstrabit',
  description: 'Save and organize your favorite websites with Smart Bookmark',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  const isLoginPage = pathname.includes('/login')

  return (
    <html lang="en" className="h-full">
      <body className={`${geist.className} h-full bg-[#0f1117] text-[#e8eaf0] antialiased flex flex-col`}>
        {!isLoginPage && (
          <header className="sticky top-0 z-50 bg-[#0f1117]/85 backdrop-blur-md border-b border-[#2a3347] flex-shrink-0">
            <div className="max-w-[860px] mx-auto px-6 h-[60px] flex items-center justify-between">
              <div className="flex items-center gap-[10px]">
                <div className="h-[32px] w-[32px] mr-4 bg-gradient-to-br from-[#4f7eff] to-[#7b5ef8] rounded-xl flex items-center justify-center p-1.5 shadow-lg shadow-[#4f7eff]/30">
                  <svg
                    className="w-[20px] h-[20px]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                </div>


                {/* Text block */}
                <div className="flex flex-col leading-tight">
                  <span className="text-[26px] font-bold text-[#e8eaf0] tracking-tight">
                    Smart Bookmark
                  </span>
                  <span className="text-[12px] text-[#fff] tracking-wide italic">
                    by Abstrabit
                  </span>
                </div>
              </div>


              {/* Auth Button */}
              <AuthButton />
            </div>
          </header>
        )}

        {/* Main Content - Flex grow to fill space */}
        <main className="flex-1 flex items-center justify-center">
          {children}
        </main>

        {/* Footer - Only show if not login page */}
        {!isLoginPage && (
          <footer className="border-t border-[#2a3347] py-4 text-center text-xs text-[#5a6478] flex-shrink-0">
            <p>© 2024 Abstrabit Technologies. All rights reserved.</p>
          </footer>
        )}
      </body>
    </html>
  )
}