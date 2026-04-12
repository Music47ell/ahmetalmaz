import Bowser from 'bowser'
import { API_BASE_URL } from 'astro:env/client'

const TIMEOUT = 30 * 60 * 1000
const HEARTBEAT_INTERVAL = 5000 // 5s
let heartbeatTimer: number | null = null

const getVisitorId = () => {
	let id = localStorage.getItem('v_id')
	if (!id) {
		id = crypto.randomUUID()
		localStorage.setItem('v_id', id)
	}
	return id
}

const getSessionId = () => {
	const now = Date.now()
	const raw = sessionStorage.getItem('s_data')

	if (!raw) {
		const session = { id: crypto.randomUUID(), last: now }
		sessionStorage.setItem('s_data', JSON.stringify(session))
		return session.id
	}

	const session = JSON.parse(raw)

	if (now - session.last > TIMEOUT) {
		const newSession = { id: crypto.randomUUID(), last: now }
		sessionStorage.setItem('s_data', JSON.stringify(newSession))
		return newSession.id
	}

	session.last = now
	sessionStorage.setItem('s_data', JSON.stringify(session))
	return session.id
}

const getClientInfo = () => {
	const parser = Bowser.getParser(window.navigator.userAgent)
	const browser = parser.getBrowser()
	const os = parser.getOS()
	const platform = parser.getPlatform()
	const engine = parser.getEngine()

	// Fix deviceType: Bowser might return undefined or 'bot' for platform.type
	// Default to 'desktop' instead of 'Unknown' to avoid confusion
	let deviceType = platform.type || 'desktop'
	
	// Normalize deviceType values - bots shouldn't reach here anyway
	if (deviceType === 'bot') {
		deviceType = 'desktop'
	}

	return {
		language: navigator.language || 'Unknown',
		os: os.name || 'Unknown',
		osVersion: os.version || 'Unknown',
		browser: browser.name || 'Unknown',
		browserVersion: browser.version || 'Unknown',
		engine: engine.name || 'Unknown',
		engineVersion: engine.version || 'Unknown',
		deviceType: deviceType,
		deviceVendor: platform.vendor || 'Unknown',
		deviceModel: platform.model || 'Unknown',
		userAgent: navigator.userAgent,
		screenResolution: `${window.screen.width}x${window.screen.height}`,
	}
}

/**
 * Cleans and normalizes a referrer URL. Returns "Direct" if:
 * - referrer is empty or already "Direct"
 * - referrer is a localhost or development URL
 * - referrer cannot be parsed
 */
const cleanReferrer = (referrer: string): string => {
	if (!referrer || referrer.trim() === '' || referrer === 'Direct') {
		return 'Direct'
	}

	try {
		const url = new URL(referrer)
		const hostname = url.hostname.toLowerCase()

		// Filter out localhost and development URLs
		if (
			hostname === 'localhost' ||
			hostname === '127.0.0.1' ||
			hostname === '0.0.0.0' ||
			hostname.endsWith('.localhost') ||
			hostname.includes(':4321') || // Astro dev port
			hostname.includes(':3000') || // Common dev ports
			hostname.includes(':8080')
		) {
			return 'Direct'
		}

		return referrer
	} catch {
		// Unparseable URL — treat as direct
		return 'Direct'
	}
}

const sendEvent = async (
	payload: Record<string, any>,
	path = '/correct-horse-battery-staple',
) => {
	const headers: Record<string, string> = { 'Content-Type': 'application/json' }

	fetch(`${API_BASE_URL}${path}`, {
		method: 'POST',
		headers,
		body: JSON.stringify(payload),
		keepalive: true,
	})
}

// --- PAGEVIEW TRACKING ---
export const trackEvent = (eventType: string, eventName = '', extra = {}) => {
	// Don't track in development
	if (import.meta.env.DEV) return

	const visitorId = getVisitorId()
	const sessionId = getSessionId()
	const clientInfo = getClientInfo()

	sendEvent({
		visitorId,
		sessionId,
		eventType,
		eventName,
		title: document.title,
		slug: window.location.pathname, // ALWAYS pathname only, never full URL
		referrer: cleanReferrer(document.referrer),
		...clientInfo,
		...extra,
	})
}

export const trackPageView = (statusCode = 200) => {
	// Don't track in development
	if (import.meta.env.DEV) return

	trackEvent('pageview', '', { statusCode })
}

// --- HEARTBEAT TRACKING ---
export const trackHeartbeat = () => {
	if (import.meta.env.DEV) return

	const visitorId = getVisitorId()
	const slug = window.location.pathname

	fetch(`${API_BASE_URL}/heartbeat`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ visitorId, slug }),
		keepalive: true,
	})
}

export const startHeartbeat = () => {
	if (import.meta.env.DEV) return
	if (heartbeatTimer) return

	trackHeartbeat() // send immediately

	heartbeatTimer = window.setInterval(() => {
		if (document.visibilityState === 'visible') {
			trackHeartbeat()
		}
	}, HEARTBEAT_INTERVAL)
}

export const stopHeartbeat = () => {
	if (heartbeatTimer) {
		clearInterval(heartbeatTimer)
		heartbeatTimer = null
	}
}
