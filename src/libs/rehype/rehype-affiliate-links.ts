import { visit } from 'unist-util-visit';
import fs from 'fs';
import path from 'path';

// Load affiliate links from a JSON file in the src/data directory
const affiliateLinksPath = path.join('src', 'data', 'affiliate-links.json');
const affiliateLinks: Record<string, string> = JSON.parse(fs.readFileSync(affiliateLinksPath, 'utf-8'));

export default function rehypeAffiliateLinks() {
  return (tree: any) => {
    visit(tree, 'text', (node, index, parent) => {
      // Skip if no parent or not a string
      if (!parent || typeof node.value !== 'string') return;

      // Skip if the parent is already a link
      if (parent.tagName === 'a') return;

      let replaced = false;
      const newChildren: any[] = [];
      let remainingText = node.value;

      for (const [keyword, link] of Object.entries(affiliateLinks)) {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        let match: RegExpExecArray | null;
        let lastIndex = 0;

        while ((match = regex.exec(remainingText)) !== null) {
          replaced = true;
          const before = remainingText.slice(lastIndex, match.index);
          if (before) newChildren.push({ type: 'text', value: before });

          newChildren.push({
            type: 'element',
            tagName: 'a',
            properties: {
              href: link,
              target: '_blank',
              rel: 'nofollow noopener noreferrer',
            },
            children: [{ type: 'text', value: match[0] }],
          });

          lastIndex = regex.lastIndex;
        }

        if (replaced) {
          const after = remainingText.slice(lastIndex);
          if (after) newChildren.push({ type: 'text', value: after });
          break; // Stop after first match to avoid overlapping replacements
        }
      }

      if (replaced && parent && typeof index === 'number') {
        parent.children.splice(index, 1, ...newChildren);
      }
    });
  };
}
