import { defineConfig } from 'astro/config'
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeSlug from "rehype-slug";
import { visit } from "unist-util-visit";
import rehypeExpressiveCode from "rehype-expressive-code";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";

// Expressive Code config
const ecConfig = defineConfig({
  theme: "dracula",
  plugins: [pluginLineNumbers()],
  defaultProps: {
    // Disable line numbers by default
    showLineNumbers: false,
    style: {
    marginTop: 16,
    marginBottom: 16,
  },
  },
});

// Tailwind classes for HTML elements
const elementClasses: Record<string, string> = {
  a: "not-prose inline-flex items-center align-middle text-dracula-marcelin hover:text-dracula-marcelin-500 gap-1 squiggle-link",
  blockquote: "border-l-2 border-zinc-300 dark:border-zinc-700 pl-3",
  pre: "!mb-3 font-mono overflow-x-auto rounded-lg bg-gray-900 p-3",
  code: "border border-dracula-dracula bg-[#282a36] px-1 text-zinc-100",
  h1: "text-3xl md:text-4xl font-bold tracking-wide text-zinc-100",
  h2: "text-2xl md:text-3xl font-bold tracking-wide text-zinc-100",
  h3: "text-lg md:text-xl font-bold tracking-wide text-zinc-100",
  h4: "md:text-lg font-bold tracking-wide text-zinc-100",
  h5: "md:text-lg font-bold tracking-wide text-zinc-100",
  h6: "md:text-lg font-bold tracking-wide text-zinc-100",
  hr: "squiggle-hr my-4",
  p: "leading-snug text-zinc-100",
  strong: "text-zinc-100 font-bold",
  table: "w-full text-sm",
  th: "bg-neutral-500 p-4 border-b border-zinc-700",
  tr: "bg-neutral-600 hover:bg-neutral-700",
  td: "p-4",
  li: "text-zinc-100",
  ol: "list-decimal marker:text-dracula-marcelin",
  ul: "list-disc marker:text-dracula-marcelin",
};

// Adds anchor links to headings
function addHeadingAnchors() {
  return (tree: any) => {
    visit(tree, "element", (node: any) => {
      if (!/^h[1-6]$/.test(node.tagName)) return;
      if (!node.properties?.id) return;

      const anchor = {
        type: "element",
        tagName: "a",
        properties: {
          href: `#${node.properties.id}`,
          className: [
            "ml-2",
            "text-dracula-marcelin",
            "no-underline",
            "opacity-0",
            "group-hover:opacity-100",
            "transition-opacity",
          ],
          ariaHidden: "true",
          tabIndex: -1,
        },
        children: [{ type: "text", value: "#" }],
      };

      node.children.push(anchor);
      node.properties.className ??= [];
      node.properties.className.push("group");
    });
  };
}

// Main processing function
export async function processPostContent(markdown: string) {
  const processor = unified()
    .use(remarkParse) // Markdown → MDAST
    .use(remarkRehype, { allowDangerousHtml: true }) // MDAST → HAST
    .use(rehypeSlug) // Generate IDs for headings
    .use(addHeadingAnchors) // Add anchor links
    .use(() => (tree) => { // Apply Tailwind classes
      visit(tree, "element", (node: any, _, parent) => {
        const tag = node.tagName;
        if (!elementClasses[tag]) return;

        if (tag === "code" && parent?.tagName === "pre") return;

        node.properties ??= {};
        const existing = node.properties.className ?? [];
        const classes = elementClasses[tag].split(" ");
        node.properties.className = [...existing, ...classes];

        if (/^h[1-6]$/.test(tag)) {
          node.properties.className.push(
            "inline-flex",
            "items-center",
            "gap-x-2",
            "group"
          );
        }
      });
    })
    .use(rehypeExpressiveCode, ecConfig) // Highlight code with Expressive Code + line numbers plugin
    .use(rehypeStringify); // HAST → HTML string

  const file = await processor.process(markdown);
  return String(file);
}
