import { createHighlighter } from 'shiki';
import type { Highlighter } from 'shiki'

let highlighter: Highlighter | null = null;

async function getHighlighter() {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ["dracula"],
      langs: ["js", "ts", "html", "css", "json", "bash", "md", "php", "tsx", "txt", "shell", "http", "typescript"],
    });
  }
  return highlighter;
}

export async function highlight(code: string, lang = "txt") {
  const hl = await getHighlighter();
  return hl.codeToHtml(code, {
    lang,
    theme: "dracula",
  });
}
