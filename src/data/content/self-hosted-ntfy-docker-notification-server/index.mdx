---
title: How to Deploy Self Hosted Ntfy Notification Server Using Docker
excerpt: Learn How to Deploy Self Hosted Ntfy Notification Server Using Docker
slug: self-hosted-ntfy-docker-notification-server
draft: false
category: How To
tags: ['How To', 'Self Hosted', 'Hetzner', 'Docker', 'Ntfy']
published: 2025-12-10T17:25:00+0300
updated: 2025-12-10T17:25:00+0300
toot: '115971842189699047'
---
You’ve probably heard of [**ntfy**](https://ntfy.sh/). It’s an open-source, self-hosted push notification service that lets you send real-time messages to phones, desktops, and even scripts over simple HTTP/HTTPS requests.

In this article, I’ll walk you through **exactly how I set up my own self-hosted ntfy server using Docker**, including why I chose it, the full Docker Compose configuration I use in production, and the step-by-step process that ensures security, reliability, and performance behind a reverse proxy.

---

## Why I Chose Self-Hosted Ntfy Over Cloud Notification Services

Before jumping into the **ntfy Docker setup**, let me explain why I went down this path.

- **Privacy First**: Cloud services like Pushover or Telegram log your messages. With **self-hosted ntfy**, every notification stays on my server.
- **Zero Cost**: No subscriptions, no rate limits, just pure, unlimited push notifications.
- **Cross-Platform**: The ntfy app works on Android, iOS, macOS, Linux, and even Windows via CLI or webhooks.
- **Simple API**: Sending a notification is as easy as `curl -d "Hello!" ntfy.domain.com/mytopic`.
- **Full Control**: I manage authentication, cache, attachments, and access policies, no opaque TOS or sudden API shutdowns.

For home labs, CI/CD alerts, server monitoring, or personal reminders, **ntfy is the most lightweight and flexible solution I’ve found**.

---

## How My Ntfy Docker Compose Configuration Works

The core of my setup is a **Docker Compose file** that defines a secure, persistent, and production-ready ntfy instance. Here’s the full `docker-compose.yml` I use:

```yaml
name: ntfy
services:
  ntfy:
    image: binwiederhier/ntfy
    restart: unless-stopped
    container_name: ntfy
    environment:
      NTFY_BASE_URL: https://ntfy.domain.com
      NTFY_CACHE_FILE: /var/lib/ntfy/cache.db
      NTFY_AUTH_FILE: /var/lib/ntfy/auth.db
      NTFY_AUTH_DEFAULT_ACCESS: deny-all
      NTFY_BEHIND_PROXY: true
      NTFY_ATTACHMENT_CACHE_DIR: /var/lib/ntfy/attachments
      NTFY_ENABLE_LOGIN: true
    volumes:
      - /docker/data/ntfy:/var/lib/ntfy
    command: serve
```

### Breaking Down the Key Settings

- **`NTFY_BASE_URL`**: Crucial for generating correct webhook URLs and web UI links. Must match your public domain.
- **`NTFY_CACHE_FILE` & `NTFY_ATTACHMENT_CACHE_DIR`**: Persistent storage for message history and file attachments (e.g., screenshots, logs).
- **`NTFY_AUTH_FILE` + `NTFY_AUTH_DEFAULT_ACCESS: deny-all`**: Enforces authentication, no open relay! Only authorized users can publish or subscribe.
- **`NTFY_ENABLE_LOGIN: true`**: Adds a login UI so users can authenticate via username/password.
- **`NTFY_BEHIND_PROXY: true`**: Tells ntfy it’s behind a reverse proxy (like Nginx or Traefik), so it trusts `X-Forwarded-For` headers for correct IP logging.
- **Volume Mount**: All data lives outside the container (`/docker/data/ntfy`), ensuring survival across updates or restarts.

### How to Create Your First User
ntfy doesn’t create users automatically. Use the CLI inside the container:

```bash
docker exec -it ntfy ntfy user add username password
```

Follow prompts to set a password. Now you can log in at `https://ntfy.domain.com`!

### How to Send a Test Notification

```bash
curl -u myusername:mypassword \
  -H "Title: Server Alert" \
  -d "CPU usage is over 90%!" \
  https://ntfy.domain.com/alerts
```

Install the **ntfy app** on your phone, subscribe to `alerts`, and, boom, you’ve got end-to-end private push notifications!

---

## Conclusion: Why This Setup is a Game-Changer for Privacy-Focused Users

Deploying a **self-hosted ntfy server with Docker** has transformed how I handle alerts, reminders, and automation triggers. It’s **secure**, **lightweight**, and **fully under my control**, no data sold, no ads, no tracking.

Thanks to the **persistent volumes**, **authentication enforcement**, and **reverse proxy integration**, my ntfy instance runs 24/7 without issues. I currently use it for:
- CI/CD pipeline status updates
- SSH
- Watchtower
- ...more!

If you’ve been looking for a **private, open-source alternative to cloud push services**, I highly recommend following this guide. In under 15 minutes, you’ll have a **fully functional and future-proof notification system**.

Ready to take back control of your notifications? Spin up your own ntfy server today on [Hetzner](https://ahmetalmaz.com/go/hetzner), and never miss an alert again.