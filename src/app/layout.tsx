import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Company Board - 사내 게시판",
  description: "공지사항, 자유게시판, 질문/답변을 위한 사내 공유 게시판",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-blue-600">
              Company Board
            </a>
            <a
              href="/posts/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              새 글 작성
            </a>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
