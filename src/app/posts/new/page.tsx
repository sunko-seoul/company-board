"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

const CATEGORIES = ["공지사항", "자유게시판", "질문/답변"];

export default function NewPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.get("title"),
          content: form.get("content"),
          author: form.get("author"),
          category: form.get("category"),
        }),
      });
      if (res.ok) {
        const post = await res.json();
        router.push(`/posts/${post.id}`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Link href="/" className="text-sm text-gray-500 hover:text-blue-600 mb-4 inline-block">
        ← 목록으로
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h1 className="text-xl font-bold mb-6">새 글 작성</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">작성자</label>
              <input
                name="author"
                type="text"
                required
                placeholder="이름을 입력하세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
              <select
                name="category"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
            <input
              name="title"
              type="text"
              required
              placeholder="제목을 입력하세요"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
            <textarea
              name="content"
              required
              rows={10}
              placeholder="내용을 입력하세요"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "등록 중..." : "게시하기"}
            </button>
            <Link
              href="/"
              className="px-6 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
            >
              취소
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
