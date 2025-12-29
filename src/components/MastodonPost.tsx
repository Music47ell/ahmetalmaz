import { useEffect, useState } from "react";

type TootCardProps = {
  mastodon_status: any;
};

type CommentNode = any & { children?: CommentNode[] };

export default function TootCard({ mastodon_status }: TootCardProps) {
  const [commentsTree, setCommentsTree] = useState<CommentNode[]>([]);

  useEffect(() => {
    if (!mastodon_status?.id) return;

    const fetchComments = async () => {
      try {
        const res = await fetch(
          `https://mastodon.social/api/v1/statuses/${mastodon_status.id}/context`
        );
        const data = await res.json();

        const descendants: CommentNode[] = data.descendants || [];
        const map: Record<string, CommentNode> = {};

        // Initialize map and children array
        descendants.forEach((c) => {
          map[c.id] = { ...c, children: [] };
        });

        const tree: CommentNode[] = [];

        descendants.forEach((c) => {
          if (c.in_reply_to_id === mastodon_status.id) {
            // Direct reply to main status
            tree.push(map[c.id]);
          } else if (c.in_reply_to_id && map[c.in_reply_to_id]) {
            // Nested reply
            map[c.in_reply_to_id].children!.push(map[c.id]);
          }
        });

        setCommentsTree(tree);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      }
    };

    fetchComments();
  }, [mastodon_status?.id]);

  if (!mastodon_status) return null;

  const date = new Date(mastodon_status.created_at).toLocaleDateString();

  const renderComments = (comments: CommentNode[], level = 0) => (
    <div className="space-y-4">
      {comments.map((comment) => (
  <div
    key={comment.id}
    className="rounded-md border border-zinc-700 bg-zinc-800 p-3"
          style={{ marginLeft: `${level * 8}px`, marginTop: `${level * 8}px` }}
  >
    <div className="flex items-center gap-2 mb-2">
      <a href={comment.account.url} target="_blank" rel="noopener noreferrer">
        <img
          src={comment.account.avatar}
          alt={comment.account.username}
          className="h-6 w-6 rounded-full"
        />
      </a>
      <span className="text-sm text-zinc-200">
        <a
          href={comment.account.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium hover:underline prose prose-invert"
        >
          {comment.account.display_name || comment.account.username}
        </a>

      </span>

    </div>
        <div
          className="prose prose-invert max-w-none text-sm"
          dangerouslySetInnerHTML={{ __html: comment.content }}
        />
    {comment.children && comment.children.length > 0 &&
      renderComments(comment.children, level + 1)}
  </div>
))}

    </div>
  );

  return (
    <div className="my-8 rounded border border-zinc-500 print:hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 text-sm text-zinc-200">
        <svg className="h-4 w-4" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Mastodon</title><path fill="#6364FF" d="M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-5.288.309C3.882.692 1.496 2.518.917 5.127.64 6.412.61 7.837.661 9.143c.074 1.874.088 3.745.26 5.611.118 1.24.325 2.47.62 3.68.55 2.237 2.777 4.098 4.96 4.857 2.336.792 4.849.923 7.256.38.265-.061.527-.132.786-.213.585-.184 1.27-.39 1.774-.753a.057.057 0 0 0 .023-.043v-1.809a.052.052 0 0 0-.02-.041.053.053 0 0 0-.046-.01 20.282 20.282 0 0 1-4.709.545c-2.73 0-3.463-1.284-3.674-1.818a5.593 5.593 0 0 1-.319-1.433.053.053 0 0 1 .066-.054c1.517.363 3.072.546 4.632.546.376 0 .75 0 1.125-.01 1.57-.044 3.224-.124 4.768-.422.038-.008.077-.015.11-.024 2.435-.464 4.753-1.92 4.989-5.604.008-.145.03-1.52.03-1.67.002-.512.167-3.63-.024-5.545zm-3.748 9.195h-2.561V8.29c0-1.309-.55-1.976-1.67-1.976-1.23 0-1.846.79-1.846 2.35v3.403h-2.546V8.663c0-1.56-.617-2.35-1.848-2.35-1.112 0-1.668.668-1.67 1.977v6.218H4.822V8.102c0-1.31.337-2.35 1.011-3.12.696-.77 1.608-1.164 2.74-1.164 1.311 0 2.302.5 2.962 1.498l.638 1.06.638-1.06c.66-.999 1.65-1.498 2.96-1.498 1.13 0 2.043.395 2.74 1.164.675.77 1.012 1.81 1.012 3.12z"/></svg>
        <a
          href={mastodon_status.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-white text-sm font-medium px-2 py-0.5 rounded-md bg-gradient-to-r from-[#6364FF] to-[#8c61ff] hover:opacity-90 transition-all"
        >
          Discuss on the ’don
        </a>

        <span className="text-zinc-400">{date}</span>
      </div>

      {/* Content */}
      <div
        className="p-3 prose prose-invert prose-p:my-3 max-w-none"
        dangerouslySetInnerHTML={{ __html: mastodon_status.content }}
      />

      {/* Media */}
      {mastodon_status.media_attachments?.length > 0 && (
        <div className="grid grid-cols-3 gap-2 p-3 prose-img:m-0">
          {mastodon_status.media_attachments.map((media: any, i: number) => (
            <img
              key={media.id}
              src={media.preview_url}
              alt={media.description ?? ""}
              className={
                i === 0
                  ? "col-span-3 w-full rounded"
                  : "aspect-square w-full rounded object-cover"
              }
            />
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-around border-t border-zinc-600 bg-zinc-800 px-4 py-2 text-sm">
        <a
          href={mastodon_status.url}
          target="_blank"
          className="flex items-center gap-1 hover:text-red-400 text-white no-underline"
        >
         <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" class="icon icon-reply" title="" aria-hidden="true"><path d="M760-200v-160q0-50-35-85t-85-35H273l144 144-57 56-240-240 240-240 57 56-144 144h367q83 0 141.5 58.5T840-360v160h-80Z"></path></svg>
          {mastodon_status.replies_count}
        </a>

        <a
          href={`${mastodon_status.url}/reblogs`}
          target="_blank"
          className="flex items-center gap-1 hover:text-red-400 text-white no-underline"
        >
         <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" class="icon icon-retweet" title="" aria-hidden="true"><path d="M280-80 120-240l160-160 56 58-62 62h406v-160h80v240H274l62 62-56 58Zm-80-440v-240h486l-62-62 56-58 160 160-160 160-56-58 62-62H280v160h-80Z"></path></svg>
          {mastodon_status.reblogs_count}
        </a>

        <a
          href={`${mastodon_status.url}/favourites`}
          target="_blank"
          className="flex items-center gap-1 hover:text-red-400 text-white no-underline"
        >
         <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" class="icon icon-star" title="" aria-hidden="true"><path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"></path></svg>
          {mastodon_status.favourites_count}
        </a>
      </div>

      {/* Comments */}
      {commentsTree.length > 0 && (
        <div className="text-sm text-zinc-200 whitespace-pre-wrap break-words bg-zinc-900 px-4 py-4 prose-img:m-0">
          {renderComments(commentsTree)}
        </div>
      )}
    </div>
  );
}
