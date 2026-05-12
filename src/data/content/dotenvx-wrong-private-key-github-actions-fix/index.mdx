---
title: Dotenvx WRONG_PRIVATE_KEY in GitHub Actions Fix
excerpt: Fix the dotenvx WRONG_PRIVATE_KEY error in GitHub Actions after committing encrypted .env files. How it happened, what I tried, and how I solved it.
slug: dotenvx-wrong-private-key-github-actions-fix
draft: false
category: How To
tags: ['How To', 'dotenvx', 'GitHub', 'GitHub']
published: 2026-02-22T17:43:00+0300
updated: 2026-02-22T17:43:00+0300
toot: '116115517464202807'
---
I recently started using **[dotenvx](https://dotenvx.com/)** to encrypt environment files for the repo of this site. The goal was simple: keep `.env` files versioned safely in Git while maintaining secure secrets management across local development and CI.

On paper, it’s clean. In practice, I hit a breaking issue in my **GitHub Actions** workflow that cost me time and forced a full Git history rewrite.

Here’s exactly what happened, what I tried, why the error didn’t make sense, and how I ultimately fixed it.

If you’re seeing `WRONG_PRIVATE_KEY` in CI even though your key is correct, read this carefully.

---

## The Setup

I had two environment files:

* `.env.development`
* `.env.ci`

To follow best practices with dotenvx, I encrypted both:

```bash
dotenvx encrypt -f .env.development
dotenvx encrypt -f .env.ci
```

This generated a `.env.keys` file containing:

* `DOTENV_PRIVATE_KEY_DEVELOPMENT`
* `DOTENV_PRIVATE_KEY_CI`

Everything looked good.

The encrypted `.env.development` and `.env.ci` files were safe to commit (that’s the whole point of dotenvx), so I pushed them to Git.

Locally, everything worked.

Then CI broke.

---

## The Error

In GitHub Actions, I injected only the CI key:

```dotenv
DOTENV_PRIVATE_KEY_CI=xxxxxxx
```

But the workflow failed with:

```log
[WRONG_PRIVATE_KEY] could not decrypt [SOME_VARIABLE] 
using private key 'DOTENV_PRIVATE_KEY_CI=xxxxxxx'
```

Here’s the thing:

* The key was correct.
* The environment variable was set correctly.
* The value matched what was generated.
* It worked locally.

But CI insisted the private key was wrong.

---

## Expected Behavior

dotenvx should only attempt to decrypt `.env.ci` using `DOTENV_PRIVATE_KEY_CI`.

That’s logical. In CI, we don’t need development secrets.

But instead, I got `WRONG_PRIVATE_KEY` error.

Another developer documented the same issue in the dotenvx repository:

* [dotenvx issue #466](https://github.com/dotenvx/dotenvx/issues/466)

So this wasn’t just me.

---

## Why This Happens

In my case, this issue happened while running everything with **Bun**.

I never tested it with **Node.js** myself. But based on [reports from others in the GitHub issue](https://github.com/dotenvx/dotenvx/issues/466#issuecomment-2911906615), the same setup worked under Node and started failing after switching to Bun.

From the discussion, it appears this may be related to runtime differences. dotenvx depends on native cryptographic APIs that are stable in Node.js. Bun’s implementation may not yet behave identically in every edge case, especially around encryption/decryption handling.

So the failure wasn’t just about multiple `.env` files being present. It may also be influenced by the runtime environment.

I only used Bun, and under Bun, this issue consistently appeared.

---

## The Fix: Remove the File from Git History

At that point, I made a decision:

**Completely remove `.env.development` from the repository.**

Not just delete it in a new commit.
Remove it entirely.

I removed the file permanently using `git-filter-repo`.

First, install it:

```bash
sudo apt install git-filter-repo
```

Before touching history, create a backup:

```bash
cd ..
cp -r my-repo my-repo-backup
```

Then remove the file from the entire Git history:

```bash
git filter-repo --path path/to/.env.development --invert-paths
```

After that, force-push the cleaned repository:

```bash
git push origin --force --all
git push origin --force --tags
```

Yes, this rewrites history.

Don’t do this lightly. If you’re working on a shared repo, coordinate with your team.

But in my case, I wanted the file gone completely. No traces. No edge cases. No guessing.

After that, CI worked.

---

## After Removing the File

Once `.env.development` was completely removed from Git history:

* CI ran.
* dotenvx decrypted `.env.ci`.
* No `WRONG_PRIVATE_KEY`.
* Workflow passed.

Problem solved.

---

## Conclusion

The `WRONG_PRIVATE_KEY` error in GitHub Actions isn’t always about a wrong key.

In my case, the key was correct and the fix wasn’t elegant.

I had to completely remove the unnecessary encrypted file from Git history using `git-filter-repo` and force-push the cleaned repository.

After that, CI worked immediately.