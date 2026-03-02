/* eslint-disable style/object-curly-spacing */
import type { LayoutProps, Metadata } from "rari";

export default function RootLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#faf8ef]">
      <nav className="bg-[#bbada0] px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-white">
            2048
          </a>
          <div className="flex gap-2">
            <a
              href="/"
              className="px-3 py-1 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
            >
              Play
            </a>
            <a
              href="/about"
              className="px-3 py-1 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
            >
              About
            </a>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}

export const metadata: Metadata = {
  title: "2048 Game",
  description: "A feature-rich 2048 game",
};
