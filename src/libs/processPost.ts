import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import rehypeShiki from "@shikijs/rehype";
import { visit } from "unist-util-visit";

const elementClasses: Record<string, string> = {
  a: "not-prose inline-flex items-center align-middle text-red-500 gap-1 bg-gray-500/10 squiggle-link rounded-md transition-colors",
  blockquote: "border-l-2 border-zinc-300 dark:border-zinc-700 pl-3",
  pre: "!mb-3 font-mono overflow-x-auto rounded-lg bg-gray-900 p-3",
  code: "border border-zinc-500 bg-[#282a36] px-1 text-zinc-100",
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
  ol: "list-decimal marker:text-yellow-500",
  ul: "list-disc marker:text-yellow-500",
};

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
            "text-red-500",
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


export async function processPostContent(html: string) {
  const processor = unified()
    .use(rehypeParse, { fragment: true })
    .use(addHeadingAnchors)
    .use(() => (tree) => {
  visit(tree, "element", (node: any, _, parent) => {
    const tag = node.tagName;
    if (!elementClasses[tag]) return;

    if (tag === "code" && parent?.tagName === "pre") return;

    node.properties ??= {};
    const existing = node.properties.className ?? [];
    const classes = elementClasses[tag].split(" ");
    node.properties.className = [...existing, ...classes];

    // Heading flex + gap
    if (/^h[1-6]$/.test(tag)) {
      node.properties.className.push("inline-flex", "items-center", "gap-x-2", "group");
    }
  });


// External link favicons
visit(tree, "element", (node: any) => {
  if (
    node.tagName === "a" &&
    typeof node.properties?.href === "string" &&
    node.properties.href.startsWith("http")
  ) {
    try {
      const domain = new URL(node.properties.href).hostname;

      // Prepend favicon
      node.children.unshift({
        type: "element",
        tagName: "img",
        properties: {
          src: `https://favicon.controld.com/${domain}`,
          alt: domain,
          width: 16,
          height: 16,
          loading: "lazy",
          className: [
            "w-4",
            "h-4",
            "inline-block",
            "not-prose",
            "rounded-sm",
          ],
        },
        children: [],
      });
    } catch {
      // ignore invalid URLs
    }
  }
});
})

    .use(rehypeShiki, { theme: "dracula" })
    .use(rehypeStringify);

  const file = await processor.process(html);
  return String(file);
}
