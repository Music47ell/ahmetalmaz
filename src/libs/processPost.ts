// src/lib/processPostContent.ts
import { highlight } from "../utils/highlight";
import { JSDOM } from "jsdom";

// Tailwind classes for elements
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

// Helper to generate slug/id from heading text
function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-+/g, "-")
    .replace(/^\-+|\-+$/g, "");
}

export async function processPostContent(html: string) {
  // Normalize language class names for syntax highlighting
  const fixedHtml = html.replace(
    /class="[^"]*lang-(\w+)[^"]*"/g,
    'class="language-$1"'
  );

  const dom = new JSDOM(fixedHtml);
  const document = dom.window.document;

  // === Highlight code blocks ===
  // const codeBlocks = document.querySelectorAll("pre code");
  // for (const block of codeBlocks) {
  //   const lang = block.className.replace(/^.*language-/, "").trim() || "txt";
  //   const code = block.textContent || "";
  //   const highlighted = await highlight(code, lang);

  //   const wrapper = document.createElement("div");
  //   wrapper.innerHTML = highlighted;
  //   block.parentElement?.replaceWith(wrapper.firstElementChild!);
  // }

  // === Apply Tailwind classes ===
  Object.entries(elementClasses).forEach(([tag, classes]) => {
    const elements = document.querySelectorAll(tag);

    elements.forEach((el) => {
      if (tag === "code" && el.parentElement?.tagName.toLowerCase() === "pre") {
        return; // skip block code
      }

      el.className = classes;

      // Add anchor links for headings
      if (/^h[1-6]$/.test(tag)) {
        const text = el.textContent || "";
        const id = slugify(text);
        el.setAttribute("id", id);
        el.textContent = "";

        const anchor = document.createElement("a");
        anchor.href = `#${id}`;
        anchor.className =
          "text-red-500 hover:decoration-yellow-500 transition-colors duration-100 hover:underline mr-2";
        anchor.textContent = "#";

        el.appendChild(anchor);
        el.appendChild(document.createTextNode(text));
      }
    });
  });

  // === Add favicons to external links ===
  const links = document.querySelectorAll("a[href]");
  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("http")) return;

    try {
      const domain = new URL(href).hostname;
      const faviconUrl = `https://favicon.controld.com/${domain}`;

      // Add favicon image before text
      const img = document.createElement("img");
      img.src = faviconUrl;
      img.alt = domain;
      img.width = 16;
      img.height = 16;
      img.loading = "lazy";
      img.className = "w-4 h-4 inline-block m-0 not-prose";

      link.prepend(img);
    } catch {
      // ignore malformed URLs
    }
  });

  return document.body.innerHTML;
}
