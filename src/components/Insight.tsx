import { useEffect } from "react";
import {PUBLIC_API_BASE_URL, PUBLIC_INSIGHT_TOKEN} from 'astro:env/client'

const TrackPageView: React.FC = () => {
  useEffect(() => {

    fetch(`${PUBLIC_API_BASE_URL}/correct-horse-battery-staple`, {
      method: "POST",
      headers: {
        Authorization: PUBLIC_INSIGHT_TOKEN,
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
