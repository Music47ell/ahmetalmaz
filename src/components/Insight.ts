import Bowser from "bowser";
import { API_BASE_URL, INSIGHT_TOKEN } from "astro:env/client";

const TIMEOUT = 30 * 60 * 1000;

const getVisitorId = () => {
  let id = localStorage.getItem("v_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("v_id", id);
  }
  return id;
};

const getSessionId = () => {
  const now = Date.now();
  const raw = sessionStorage.getItem("s_data");

  if (!raw) {
    const session = { id: crypto.randomUUID(), last: now };
    sessionStorage.setItem("s_data", JSON.stringify(session));
    return session.id;
  }

  const session = JSON.parse(raw);

  if (now - session.last > TIMEOUT) {
    const newSession = { id: crypto.randomUUID(), last: now };
    sessionStorage.setItem("s_data", JSON.stringify(newSession));
    return newSession.id;
  }

  session.last = now;
  sessionStorage.setItem("s_data", JSON.stringify(session));
  return session.id;
};

const getClientInfo = () => {
  const parser = Bowser.getParser(window.navigator.userAgent);
  const browser = parser.getBrowser();
  const os = parser.getOS();
  const platform = parser.getPlatform();
  const engine = parser.getEngine();

  return {
    language: navigator.language || "Unknown",
    os: os.name || "Unknown",
    osVersion: os.version || "Unknown",
    browser: browser.name || "Unknown",
    browserVersion: browser.version || "Unknown",
    engine: engine.name || "Unknown",
    engineVersion: engine.version || "Unknown",
    deviceType: platform.type || "Unknown",
    deviceVendor: platform.vendor || "Unknown",
    deviceModel: platform.model || "Unknown",
    userAgent: navigator.userAgent,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
  };
};

const sendEvent = async (payload: Record<string, any>) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (INSIGHT_TOKEN) headers.Authorization = INSIGHT_TOKEN;

  fetch(`${API_BASE_URL}/correct-horse-battery-staple`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
    keepalive: true,
  });
};

export const trackEvent = (eventType: string, eventName = "", extra = {}) => {
  const visitorId = getVisitorId();
  const sessionId = getSessionId();
  const clientInfo = getClientInfo();

  sendEvent({
    visitorId,
    sessionId,
    eventType,
    eventName,
    title: document.title,
    slug: window.location.pathname,
    referrer: document.referrer || "Direct",
    ...clientInfo,
    ...extra,
  });
};

export const trackPageView = (statusCode = 200) => {
  trackEvent("pageview", "", { statusCode });
};
