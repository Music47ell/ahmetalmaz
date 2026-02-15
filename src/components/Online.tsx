import { useState, useEffect } from 'react';
import { API_BASE_URL } from 'astro:env/client';

export default function OnlineCount(): JSX.Element {
  const [onlineData, setOnlineData] = useState<{ total: number; pages: Record<string, number> }>({ total: 0, pages: {} });
  const [showPages, setShowPages] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function fetchOnline() {
      try {
        const res = await fetch(`${API_BASE_URL}/online`);
        const data = (await res.json()) as { total?: number; pages?: Record<string, number> };
        if (mounted) setOnlineData({ total: data.total ?? 0, pages: data.pages ?? {} });
      } catch (err) {
        console.error('Failed to fetch online pages', err);
      }
    }

    fetchOnline();
    const interval = setInterval(fetchOnline, 5000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const togglePages = () => setShowPages((prev) => !prev);

  return (
    <div className="overflow-hidden p-4 border border-dracula-dracula shadow-lg">
      <div className="flex items-center gap-5 cursor-pointer" onClick={togglePages}>
        <div className="text-dracula-cullen font-bold text-xl">{onlineData.total}</div>
        <p className="text-base md:text-xl">
          {onlineData.total === 1 ? 'person is' : 'people are'} online right now
        </p>
      </div>

      {showPages && onlineData.total > 0 && (
        <ul className="mt-2 border-t border-dracula-dracula pt-2">
          {Object.entries(onlineData.pages).map(([slug, count]) => (
            <li key={slug} className="text-sm md:text-base py-1">
              <span className="font-semibold">{count}</span> {count === 1 ? 'person' : 'people'} viewing <code>{slug}</code>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
