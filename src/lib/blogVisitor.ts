export const BLOG_VISITOR_STORAGE_KEY = "blog_visitor_id";

export function getOrCreateBlogVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(BLOG_VISITOR_STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(BLOG_VISITOR_STORAGE_KEY, id);
  }
  return id;
}
