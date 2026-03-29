import { getPosts } from "@/lib/api";
import Link from "next/link";

const CATEGORIES = ["전체", "공지사항", "자유게시판", "질문/답변"];

const categoryColors: Record<string, string> = {
  "공지사항": "bg-red-100 text-red-700",
  "자유게시판": "bg-green-100 text-green-700",
  "질문/답변": "bg-purple-100 text-purple-700",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "short", day: "numeric" });
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory = category || "전체";
  let posts;
  try {
    posts = await getPosts(activeCategory);
  } catch {
    posts = null;
  }

  return (
    <div>
      {/* Category Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={cat === "전체" ? "/" : `/?category=${encodeURIComponent(cat)}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* Post List */}
      {posts === null ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500 border border-gray-200">
          <p className="text-lg font-medium mb-2">서버 연결을 확인해주세요</p>
          <p className="text-sm">AppHub API 연결이 필요합니다.</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500 border border-gray-200">
          <p className="text-lg font-medium">게시글이 없습니다</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="block bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-sm transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[post.category] || "bg-gray-100 text-gray-600"}`}>
                      {post.category}
                    </span>
                    <h2 className="text-base font-semibold truncate">{post.title}</h2>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{post.content}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium text-gray-700">{post.author}</p>
                  <p className="text-xs text-gray-400">{formatDate(post.created_at)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
