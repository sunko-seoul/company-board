import { getPost, getComments } from "@/lib/api";
import Link from "next/link";
import CommentForm from "./comment-form";

const categoryColors: Record<string, string> = {
  "공지사항": "bg-red-100 text-red-700",
  "자유게시판": "bg-green-100 text-green-700",
  "질문/답변": "bg-purple-100 text-purple-700",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let post, comments;
  try {
    [post, comments] = await Promise.all([getPost(id), getComments(id)]);
  } catch {
    return (
      <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
        <p className="text-lg font-medium text-gray-500 mb-4">게시글을 불러올 수 없습니다</p>
        <Link href="/" className="text-blue-600 hover:underline">목록으로 돌아가기</Link>
      </div>
    );
  }

  return (
    <div>
      {/* Back link */}
      <Link href="/" className="text-sm text-gray-500 hover:text-blue-600 mb-4 inline-block">
        ← 목록으로
      </Link>

      {/* Post */}
      <article className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[post.category] || "bg-gray-100 text-gray-600"}`}>
            {post.category}
          </span>
        </div>
        <h1 className="text-2xl font-bold mb-3">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-6 pb-4 border-b border-gray-100">
          <span className="font-medium text-gray-700">{post.author}</span>
          <span>{formatDate(post.created_at)}</span>
        </div>
        <div className="prose prose-gray max-w-none whitespace-pre-wrap leading-relaxed">
          {post.content}
        </div>
      </article>

      {/* Comments */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">
          댓글 <span className="text-blue-600">{comments.length}</span>
        </h2>

        {comments.length > 0 && (
          <div className="space-y-4 mb-6">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">{comment.author}</span>
                  <span className="text-xs text-gray-400">{formatDate(comment.created_at)}</span>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
              </div>
            ))}
          </div>
        )}

        <CommentForm postId={id} />
      </section>
    </div>
  );
}
