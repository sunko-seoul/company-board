const API_URL = process.env.APPHUB_API_URL || "https://hub.jocodingax.ai";
const API_KEY = process.env.APPHUB_API_KEY || "";
const APP_SLUG = process.env.APPHUB_APP_SLUG || "company-board";

async function apphubFetch(table: string, path: string = "", options: RequestInit = {}) {
  const res = await fetch(`${API_URL}/data/${APP_SLUG}/${table}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": API_KEY,
      ...options.headers,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`AppHub API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  post_id: number;
  content: string;
  author: string;
  created_at: string;
  updated_at: string;
}

export async function getPosts(category?: string) {
  const params = new URLSearchParams();
  if (category && category !== "전체") {
    params.set("filters", JSON.stringify({ category }));
  }
  params.set("sort", "created_at:desc");
  const data = await apphubFetch("posts", `?${params}`);
  return data.data as Post[];
}

export async function getPost(id: string) {
  const data = await apphubFetch("posts", `/${id}`);
  return data as Post;
}

export async function createPost(post: { title: string; content: string; author: string; category: string }) {
  const data = await apphubFetch("posts", "", {
    method: "POST",
    body: JSON.stringify(post),
  });
  return data as Post;
}

export async function getComments(postId: string) {
  const params = new URLSearchParams();
  params.set("filters", JSON.stringify({ post_id: postId }));
  params.set("sort", "created_at:asc");
  const data = await apphubFetch("comments", `?${params}`);
  return data.data as Comment[];
}

export async function createComment(comment: { post_id: string; content: string; author: string }) {
  const data = await apphubFetch("comments", "", {
    method: "POST",
    body: JSON.stringify(comment),
  });
  return data as Comment;
}
