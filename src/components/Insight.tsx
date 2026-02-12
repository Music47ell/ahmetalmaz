import { useEffect } from "react";
import Bowser from "bowser";
import { API_BASE_URL, INSIGHT_TOKEN } from "astro:env/client";
import { capitalize } from "../utils/formatters";

interface TrackPageViewProps {
  statusCode?: number;
}

const TrackPageView: React.FC<TrackPageViewProps> = ({ statusCode }) => {
  useEffect(() => {
    const getClientInfo = () => {
      const parser = Bowser.getParser(window.navigator.userAgent);
      const browser = parser.getBrowser();
      const os = parser.getOS();
      const platform = parser.getPlatform();

      return {
        os: os.name || "Unknown",
        osVersion: os.version || "Unknown",
        browser: browser.name || "Unknown",
        browserVersion: browser.version || "Unknown",

        deviceType: platform.type || "Unknown",
        deviceVendor: platform.vendor || "Unknown",
        deviceModel: platform.model || "Unknown",

        userAgent: navigator.userAgent,
        language: navigator.language || "Unknown",
        screenResolution: `${window.screen.width}x${window.screen.height}`,
      };
    };

    const clientInfo = getClientInfo();

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
        statusCode,
        ...clientInfo,
        eventType: "pageview",
      }),
      keepalive: true,
    });
  }, [statusCode]);

  return null;
};

export default TrackPageView;
