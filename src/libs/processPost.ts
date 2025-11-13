import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { visit } from "unist-util-visit";
import rehypeShiki from "@shikijs/rehype";
import { createHighlighter } from "shiki";

const elementClasses: Record<string, string> = {
  a: "inline-flex items-center text-red-500 gap-2 underline bg-gray-500/10 hover:bg-red-500/20 rounded-md px-1 transition-colors",
  blockquote: "border-l-2 border-zinc-300 dark:border-zinc-700 pl-3",
  pre: "!mb-3 font-mono overflow-x-auto rounded-lg bg-gray-900 p-3",
  code: "border border-zinc-500 bg-[#282a36] px-1 text-zinc-100",
  h1: "text-3xl md:text-4xl font-bold tracking-wide text-zinc-100",
  h2: "text-2xl md:text-3xl font-bold tracking-wide text-zinc-100",
  h3: "text-lg md:text-xl font-bold tracking-wide text-zinc-100",
  h4: "md:text-lg font-bold tracking-wide text-zinc-100",
  h5: "md:text-lg font-bold tracking-wide text-zinc-100",
  h6: "md:text-lg font-bold tracking-wide text-zinc-100",
  hr: "border-t border-gray-700 my-4",
  p: "leading-snug text-zinc-100",
  strong: "text-zinc-100 font-bold",
  input: "border rounded px-2 py-1 text-gray-800",
  table: "w-full text-sm",
  th: "bg-neutral-500 p-4 border-b border-zinc-700",
  tr: "bg-neutral-600 hover:bg-neutral-700 focus:bg-neutral-700 active:bg-neutral-700",
  td: "p-4",
  li: "text-zinc-100",
  ol: "list-decimal marker:text-yellow-500",
  ul: "list-disc marker:text-yellow-500",
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-+/g, "-")
    .replace(/^\-+|\-+$/g, "");
}

export async function processPostContent(html: string) {
  const highlighter = await createHighlighter({
    langs: ["javascript", "typescript", "bash"],
  });

  const processor = unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeSanitize, {
      ...defaultSchema,
      tagNames: [...(defaultSchema.tagNames || []), "span"],
      attributes: {
        ...defaultSchema.attributes,
        span: ["className"],
        code: ["className"],
        pre: ["className"],
        a: ["href", "className"],
      },
    })
    .use(rehypeShiki, { highlighter, theme: "dracula" })
    .use(() => (tree) => {
  visit(tree, "element", (node: any, index, parent: any) => {
    const tag = node.tagName;

    // Apply custom classes, but skip <code> inside <pre>
    if (elementClasses[tag]) {
      node.properties = node.properties || {};
      if (tag === "code" && parent?.tagName === "pre") {
        // skip adding code class for code blocks
      } else {
        node.properties.className = elementClasses[tag].split(" ");
      }
    }

    // Heading anchors
    if (/^h[1-6]$/.test(tag)) {
      const textNode = node.children.find((c: any) => c.type === "text");
      const text = textNode?.value || "";
      const id = slugify(text);
      node.properties.id = id;

      const anchorNode = {
        type: "element",
        tagName: "a",
        properties: {
          href: `#${id}`,
          className: [
            "text-red-500",
            "hover:decoration-yellow-500",
            "transition-colors",
            "duration-100",
            "hover:underline",
            "mr-2",
          ],
        },
        children: [{ type: "text", value: "#" }],
      };

      node.children = [anchorNode, { type: "text", value: text }];
    }

    // External link favicons
    if (tag === "a" && node.properties?.href?.startsWith("http")) {
      try {
        const domain = new URL(node.properties.href).hostname;
        const imgNode = {
          type: "element",
          tagName: "img",
          properties: {
            src: `https://favicon.controld.com/${domain}`,
            alt: domain,
            width: 16,
            height: 16,
            loading: "lazy",
            className: ["w-4", "h-4", "inline-block", "m-0", "not-prose"],
          },
          children: [],
        };
        node.children.unshift(imgNode);
      } catch {}
    }
  });
    })
    .use(rehypeStringify);

  const file = await processor.process(html);
  return String(file);
}
