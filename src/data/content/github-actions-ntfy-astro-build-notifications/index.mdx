---
title: How to Add ntfy Notifications to GitHub Actions for Build Alerts
excerpt: How to set up real-time build notifications from GitHub Actions to your phone and desktop using ntfy
slug: github-actions-ntfy-astro-build-notifications
draft: false
category: How To
tags: ['How To', 'Hetzer', 'GitHub', 'GitHub Action', 'Self Hosted', 'Ntfy']
published: 2025-12-14T19:04:00+0300
updated: 2025-12-14T19:04:00+0300
toot: '115971843076645997'
---
In a [previous article](https://ahmetalmaz.com/blog/astro-headless-wordpress-hetzner), I talked about containerizing my Astro site using Docker and deploying it via GitHub Actions. While that setup automated my entire CI/CD pipeline beautifully, I quickly realized a major gap: **I had no way of knowing whether my Astro build succeeded or failed unless I manually checked GitHub Actions logs**.

I recently explained why and how I [self-host ntfy](https://ahmetalmaz.com/blog/self-hosted-ntfy-docker-notification-server). In this post, I’ll show you how to set up real-time build notifications from GitHub Actions to your phone and desktop using ntfy. I’ll cover why I chose this method, how it integrates with GitHub Actions, and the exact steps to implement it.

---

## Why Use ntfy with GitHub Actions?

Traditional CI/CD pipelines often rely on email or Slack for notifications, but those can be noisy, delayed, or require complex setup. **ntfy** solves this by offering:

- **Instant push notifications** to your phone (iOS/Android), desktop (via browser or CLI), or even smartwatches
- **Zero setup cost** no accounts, no servers, just a simple HTTP POST
- **End-to-end encryption** (optional) and **bearer token authentication** for security
- **Customizable priorities, titles, and icons** for better context

For my **Astro project**, getting an immediate alert the moment a build fails, or succeeds, is critical for maintaining uptime and rapid iteration.

Plus, since ntfy works over standard HTTP, it integrates **seamlessly with GitHub Actions** using nothing more than a `curl` command. No SDKs, no dependencies.

---

## How the Notification Code Works in GitHub Actions

Here’s the exact snippet I added to my `.github/workflows/deploy.yml` file:

```yaml
- name: Send ntfy notification
  if: always()
  run: |
    STATUS="${{ job.status }}"
    curl -s -X POST \
      -H "Title: Astro Build" \
      -H "Priority: high" \
      H "Authorization: Bearer ${{ secrets.NTFY_TOKEN }}" \
      -d "Build status: $STATUS" \
      "${{ secrets.NTFY_URL }}"
```

Let me break this down **from my perspective**:

- `if: always()` ensures the notification runs **regardless of whether the job succeeded, failed, or was canceled**. This is key, I want to know *every* outcome.
- `${{ job.status }}` is a built-in GitHub Actions context that returns strings like `success`, `failure`, or `cancelled`. I inject this directly into the message body.
- The `curl` command sends a POST request to my private ntfy topic URL (stored securely in `secrets.NTFY_URL`).
- I include a **custom title** (“Astro Build”) so I can distinguish this from other project alerts.
- **Priority: high** ensures the notification pops up with sound or vibration on supported devices, perfect for urgent build failures.
- The **`Authorization: Bearer`** header uses a token (`NTFY_TOKEN`) I generated in my ntfy account, keeping my topic private and secure.

---

## Step-by-Step: Adding ntfy Alerts to Your GitHub Action

Want to replicate this in your own **GitHub Actions workflow**? Follow these steps:

### 1. **Create a ntfy Account & Topic**
Go to your self-hosted ntfy instace and create a topic (e.g., `my-astro-builds`). Then go to your profile and generate a **bearer token**.

### 2. **Store Secrets in GitHub**
In your GitHub repo:
- Go to **Settings > Secrets and variables > Actions**
- Add two secrets:
  - `NTFY_URL` = `https://ntfy.sh/your-topic-name`
  - `NTFY_TOKEN` = your generated bearer token

> 🔒 Never hardcode these in your workflow file!

### 3. **Add the Notification Step to Your Workflow**
Place the following step **at the end** of your job (after build/deploy steps):

```yaml
- name: Send ntfy notification
  if: always()
  run: |
    STATUS="${{ job.status }}"
    curl -s -X POST \
      -H "Title: Astro Build" \
      -H "Priority: high" \
      -H "Authorization: Bearer ${{ secrets.NTFY_TOKEN }}" \
      -d "Build status: $STATUS" \
      "${{ secrets.NTFY_URL }}"
```

> 💡 Pro tip: You can also add emojis, Markdown, or even file attachments via ntfy for richer alerts!

### 4. **Install the ntfy App (Optional but Recommended)**
Download the **ntfy app** on [iOS](https://apps.apple.com/us/app/ntfy/id1625396347) or [Android](https://play.google.com/store/apps/details?id=io.heckel.ntfy) to receive push notifications instantly, even when your browser is closed.

---

## Conclusion: Real-Time Visibility Without the Complexity

Adding **ntfy notifications to my GitHub Actions workflow** for **Astro builds** has been a game-changer. I no longer miss failed deployments, and I get instant peace of mind when a new container image is pushed successfully.

The best part? It took **less than 5 minutes** to implement and costs **nothing**. In a world where DevOps tooling often leans toward complexity, **ntfy + GitHub Actions** is a refreshingly simple, secure, and effective combo for **CI/CD monitoring**, **build status alerts**, and **developer productivity**.

If you’re running an **Astro site**, deploying via **GitHub Actions**, and tired of checking logs manually, give this a try. Your future self (and your on-call schedule) will thank you.