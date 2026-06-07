import { marked, Renderer } from "marked";

const renderer = new Renderer();

// Wrap images in a styled figure (matches the old MDXRemote img component)
renderer.image = function ({ href, text }) {
  const alt = text ?? "";
  const src = href ?? "";
  return `<figure class="prose-blog-figure">
  <img src="${src}" alt="${alt}" loading="lazy" decoding="async" />
</figure>`;
};

export function renderMarkdown(content: string): string {
  return marked.parse(content, { renderer, async: false }) as string;
}
