import { useEffect } from "react";
import {API_BASE_URL, INSIGHT_TOKEN} from 'astro:env/client'

const TrackPageView: React.FC = () => {
  useEffect(() => {

    fetch(`${API_BASE_URL}/correct-horse-battery-staple`, {
      method: "POST",
      headers: {
        Authorization: INSIGHT_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: document.title,
        slug: window.location.pathname,
        referrer: document.referrer || "Direct Traffic",
      }),
      keepalive: true,
    });
  }, []);

  return null;
};

export default TrackPageView;
