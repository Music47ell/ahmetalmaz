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
    <div>
      <div
        className="flex items-center gap-5 cursor-pointer p-4 border border-dracula-dracula shadow-lg"
        onClick={togglePages}
      >
        <div className="text-dracula-cullen font-bold text-xl">{onlineData.total}</div>
        <p className="text-base md:text-xl">
          {onlineData.total === 1 ? "person is" : "people are"} online right now
        </p>
      </div>

      {showPages && onlineData.total > 0 && (
        <table className="w-full border border-dracula-dracula">
          <thead>
            <tr className="border-b border-dracula-dracula">
              <th className="border-r border-dracula-dracula p-4 text-left">
                Users ({onlineData.total})
              </th>
              <th className="p-4 text-left">Page</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(onlineData.pages).map(([slug, count]) => (
              <tr key={slug} className="border-b border-dracula-dracula">
                <td className="border-r border-dracula-dracula p-4 font-semibold">
                  {count}
                </td>
                <td className="p-4">
                  <code>{slug}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
