---
title: "Hermes Agent: Your Own Open-Source AI Assistant on Telegram — for $0 (Hands-On Codelab)"
date: "2026-08-30"
tags: ["AI", "agentic-ai", "llm", "HermesAgent", "Telegram", "OpenSource", "NousResearch", "Codelab"]
author: "Novita (郭瑩慧)"
---

💡 **What if your AI assistant lived in your Telegram chat, remembered your conversations, and cost you absolutely nothing?**

That question sent me down a rabbit hole last weekend, and the answer turned out to be **Hermes Agent** — the open-source AI agent by [Nous Research](https://nousresearch.com) (the lab behind the Hermes model family). It's MIT-licensed, self-hosted, and at over 230k GitHub stars, it's clearly struck a nerve.

The usual "self-hosted agent" story ends with a $5/month VPS and a stack of API keys. I wanted to know: can a reader with **no budget at all** still get a real, working agent in their Telegram today? So I tested the entire flow in a throwaway sandbox before writing this — every command below is verified to work as of Hermes Agent v0.20.6 (August 2026). Then I went one step further and [pre-baked the whole environment into a sandbox](https://github.com/novitaguok/hermes-agent-telegram-codelab) you can open with one click, so you can skip the install entirely.

Spoiler: yes, fully free. Let's build it. 🚀

---

## 🤖 What is Hermes Agent?

Most AI tools you use daily are *tethered* — a chatbot in a browser tab, a coding copilot inside an IDE. Hermes Agent is different: it's a **long-running autonomous agent** you host yourself, that lives wherever you put it and talks to you through the apps you already use.

A few things make it genuinely interesting:

- **A closed learning loop** — it maintains persistent memory across sessions, writes its own reusable "skills" after finishing complex tasks, and improves those skills while using them. It's the only open-source agent I know of with this built-in.
- **One gateway, 20+ platforms** — Telegram, Discord, Slack, WhatsApp, Signal, email, and more, all from a single process.
- **It works with any model** — OpenRouter, OpenAI, Anthropic, Gemini, local models via Ollama, or a completely keyless free provider (which is what we'll use).
- **Built-in cron** — scheduled tasks delivered to your chat, like a personal assistant that never sleeps.
- **Runs anywhere** — your laptop, a $5 VPS, or a free sandbox like the one we'll use today.

The part that sold me personally: talking to your agent from your phone while it works on a machine you never SSH into. That's the experience we're building in this codelab.

---

## 🧾 The $0 Stack

Here's the honest accounting of our three ingredients:

| Ingredient | What it costs | The catch |
|---|---|---|
| **GitHub Codespaces** (our sandbox) | Free — 120 core-hours/month + 15 GB storage on personal accounts | Hours burn while running, so we stop it when done |
| **OpenCode Free provider** (our model) | Free — keyless, no account, no API key | Shared free models; they rotate and can be rate-limited |
| **Telegram Bot** (our interface) | Free — bots have always been free on Telegram | The bot only responds while your sandbox is awake |

No credit card anywhere. If you already have a GitHub account and a Telegram account, you have everything you need.

---

## 🛠️ Codelab: Hermes Agent on Telegram, From Zero

**What you'll build:** a Telegram bot you can DM from your phone, powered by a self-hosted Hermes Agent running in a free cloud sandbox.

**What you'll need:**

- A GitHub account (free tier is fine)
- A Telegram account
- About 15–20 minutes

### Step 1 — Open your free sandbox (one click)

I've prepared a **companion sandbox repo** for this codelab: [novitaguok/hermes-agent-telegram-codelab](https://github.com/novitaguok/hermes-agent-telegram-codelab). It's a GitHub Codespaces environment with a **pre-baked image** — Hermes Agent, its full runtime, and a free keyless model provider are already installed and configured before you ever see a terminal.

1. Open [codespaces.new/novitaguok/hermes-agent-telegram-codelab](https://codespaces.new/novitaguok/hermes-agent-telegram-codelab) and sign in with GitHub.
2. Pick the default **2-core** machine type (that's the free one) and click **Create**.
3. Wait a few minutes while the image downloads — the very first creation in your region pulls a fresh copy, so it's the slowest it will ever be. The terminal greets you with a `⚕ Hermes Agent vX.X.X is ready` banner — that's your cue that everything is installed.

When it's up, verify it yourself:

```bash
hermes --version
```

> **⏳ Free-tier math:** the codespace is a 2-core machine, so 120 free core-hours = about 60 hours of runtime per month. Plenty for a codelab — just remember to stop it (we'll cover that at the end).

**Why a pre-baked image?** The first time I tested this codelab, I ran the install manually in a bare sandbox — and hit missing `xz`, missing `libatomic`, and a node-gyp build that needed `python3`/`make`/`g++`. The standard Codespaces image has all of that, but the install still takes several minutes of downloading. So I baked the entire thing — Ubuntu, system prereqs, the official installer, and the model config — into a Docker image that GitHub Actions rebuilds automatically. Your sandbox starts ready-to-chat in about a minute.

> **🔧 Prefer the DIY path?** If you'd rather install everything yourself (in any Codespace template, or on your own Linux box), it's two commands: `curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash`, then `hermes config set model.provider opencode-free && hermes config set model.default mimo-v2.5-free`. The rest of this codelab works identically.

**About that free model:** the pre-baked config uses a keyless provider called `opencode-free` — it routes to OpenCode's free model tier anonymously. No account, no API key, no credit card. (Why `mimo-v2.5-free` specifically? I tested the free catalog end-to-end — that model, along with `nemotron-3.5-lightning-free` and `laguna-s-2.1-free`, responded reliably. Free models rotate over time, so if one acts up, run `hermes model` and pick another one ending in `-free`.)

If you'd like to see the machinery working before connecting Telegram, have a quick chat right in the terminal:

```bash
hermes chat -q "Say hello and tell me which model you are" --oneshot
```

You should get a real reply streamed into your terminal. **That's an LLM answering you, with zero credentials anywhere on this machine.** 🎉

> **💡 Honest expectations:** free models are shared infrastructure. They're great for chat, learning, and light tool use, but they're not frontier models. The beautiful thing about Hermes is that everything we build today carries over unchanged if you later plug in a paid provider — swap it with one `hermes model` command, and your bot, memory, and config all stay.

### Step 2 — Create your Telegram bot

Time to give the agent a phone number… well, a Telegram handle.

1. Open Telegram and message **@BotFather** (or visit [t.me/BotFather](https://t.me/BotFather)).
2. Send `/newbot`.
3. Choose a display name — anything you like (e.g., `My Hermes Agent`).
4. Choose a username — must be unique and end in `bot` (e.g., `novita_hermes_bot`).
5. BotFather replies with an **API token** that looks like:

```plaintext
123456789:ABCdefGHIjklMNOpqrSTUvwxYZ
```

Treat this token like a password — anyone holding it controls your bot. If it ever leaks, revoke it with `/revoke` in BotFather.

**Optional but nice:** while you're in BotFather, use `/setuserpic` to give your bot an avatar and `/setdescription` to write its intro text. A bot with a face feels much more alive.

### Step 3 — Get your Telegram user ID

Hermes doesn't let strangers control your agent — it authenticates you by your numeric Telegram user ID (not your username).

Message **@userinfobot** ([t.me/userinfobot](https://t.me/userinfobot)) and it instantly replies with a number like `123456789`. Save it.

### Step 4 — Wire Hermes to Telegram

When your sandbox was created, it seeded a credentials file at `~/.hermes/.env` with two placeholder values. Open it in the terminal editor:

```bash
nano ~/.hermes/.env
```

Replace the placeholders — the token from Step 2 and the user ID from Step 3 — so the file looks like this:

```plaintext
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrSTUvwxYZ
TELEGRAM_ALLOWED_USERS=123456789
```

Save with `Ctrl+O`, `Enter`, then exit with `Ctrl+X`. (If you want a friend to share the bot, comma-separate their user IDs.)

That's the entire integration. I love how un-ceremonial this is — no webhook tunnels, no TLS certs, no port forwarding. Hermes connects to Telegram via **long polling** (outbound requests only), which is exactly why it works inside a sandbox with no public URL.

### Step 5 — Start the gateway and chat!

Launch the messaging gateway in the foreground:

```bash
hermes gateway run
```

Watch for the connection confirmation in the logs, then open Telegram, find your bot (search its username), and send:

```plaintext
Hello! Who are you and what can you do?
```

Your phone is now talking to a self-hosted AI agent in a free cloud sandbox. 📱

A few things worth trying in that first chat:

- **Ask it to remember something** — "Remember that I prefer dark mode and concise answers." Then start a new conversation and ask what it knows about you. Persistent memory is the headline feature; feel it working.
- **Ask it a question about your sandbox** — "What OS are you running on? How much disk is free?" It'll use its terminal tool on the codespace to find out.
- **`/usage`** — built-in slash command showing token usage and estimated cost (mostly $0.00 here, which is always a nice sight).

### Step 6 — Go beyond the basics (optional)

**A dedicated topic workspace.** Send `/topic` to the bot to enable multi-session mode — then each Telegram topic you create becomes an isolated conversation with its own history. Great for separating "work questions" from "random curiosity."

**Voice memos.** Voice messages you send get auto-transcribed and injected into the conversation. Local transcription (faster-whisper) needs an extra install:

```bash
cd ~/.hermes/hermes-agent
uv pip install --python ./venv/bin/python -e ".[voice]"
```

Then restart the gateway and send the bot a voice note. It'll reply to what you *said*.

**Scheduled tasks.** Ask the agent in chat to schedule a cron job ("Every morning at 8, send me a summary of AI news") and set the chat as the delivery channel with `/sethome`. The docs' [cron guide](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron) covers delivery options.

### Step 7 — Be a good free-tier citizen

The gateway keeps your codespace busy, which keeps burning those free core-hours. When you're done playing:

- Press `Ctrl+C` in the terminal to stop the gateway.
- In the codespace window, open the command palette (`F1`) → **Codespaces: Stop Codespace** (or find it under the three-dot menu on [github.com/codespaces](https://github.com/codespaces)).

Everything persists — stop/start keeps your installed Hermes, its config, its memory, and the bot token you pasted. Next time you start the codespace, it's a 30-second boot back to a live bot: `hermes gateway run`.

> **⚠️ Rebuild is the reset button:** stopping/starting keeps everything, but a full **Rebuild** wipes the machine back to the pre-baked image — including `~/.hermes/.env` and the agent's memory. If you rebuild, just re-paste your token (the file gets re-seeded with placeholders automatically).

> **⚠️ One thing to know:** the free storage allowance is 15 GB per month. A Hermes install with its Python environment fits comfortably, but don't let the agent download giant datasets into the sandbox. You can check usage on your [Codespaces settings page](https://github.com/settings/codespaces).

---

## 🔧 Troubleshooting

I hit most of these while testing, so you don't have to:

| Problem | Fix |
|---|---|
| Model error: "Model is unavailable" | Free models rotate. Run `hermes model` and switch to another `-free` model |
| Gateway: "Telegram bot token rejected" | Typo in the token — copy it again from BotFather, or `/revoke` + `/token` to regenerate |
| Bot replies "unauthorized" | Your user ID doesn't match `TELEGRAM_ALLOWED_USERS` — re-check with @userinfobot |
| Bot works in DMs but ignores groups | Telegram's privacy mode. In BotFather: `/mybots` → your bot → **Bot Settings → Group Privacy → Turn off**, then **remove and re-add the bot to the group** (Telegram caches the old setting) |
| Everything was working, bot went silent | Your codespace went to sleep. Restart it and run `hermes gateway run` again |

And when in doubt:

```bash
hermes doctor
```

It diagnoses the most common config problems in one pass.

---

## 🌱 Where to go from here

What we built is a playground — a real agent, but on borrowed, ephemeral infrastructure. The natural next steps, roughly in order of commitment:

1. **Try stronger models.** `hermes model` walks you through every provider. If you have *any* existing subscription (OpenRouter credit, a Gemini API key, an OpenAI key), it slots in without touching anything else we set up.
2. **Give it skills.** `hermes skills browse` opens the Skills Hub — community-contributed playbooks for everything from Kubernetes deploys to arXiv research. Skills become slash commands your Telegram bot can use.
3. **Make it permanent.** A $5 VPS with `hermes gateway install` (systemd service) gives you an always-on assistant. Everything — config, memory, skills — moves with `hermes backup`.
4. **Bring friends.** The [team assistant guide](https://hermes-agent.nousresearch.com/docs/guides/team-telegram-assistant) covers multi-user setups with per-user authorization.

---

## 💭 Closing Thoughts

What stayed with me after this experiment isn't the tech demo — it's the shift in what "an AI assistant" can mean. Not an app some company lets me use, but a *thing I run*, that remembers *my* context, lives in *my* chat, and that I can hand any model I like. The barrier to trying it turned out to be one curl command and two environment variables.

The free path we took has real limits — rotating shared models, a sandbox that sleeps, 60 hours a month. But as a way to *learn* what agentic AI actually feels like day-to-day? I genuinely can't think of a cheaper on-ramp.

If you follow the codelab, I'd love to hear how it went — find me in the guestbook. 👋

---

## 📚 References

- [Hermes Agent official docs](https://hermes-agent.nousresearch.com/docs/)
- [Hermes Agent on GitHub](https://github.com/nousresearch/hermes-agent) (MIT license)
- [This codelab's companion sandbox repo](https://github.com/novitaguok/hermes-agent-telegram-codelab)
- [Telegram setup guide](https://hermes-agent.nousresearch.com/docs/user-guide/messaging/telegram/)
- [Hermes Agent quickstart](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart)
- [GitHub Codespaces — pricing and free tier](https://github.com/features/codespaces)
- [Telegram @BotFather](https://t.me/BotFather)

---

*#AI #AgenticAI #HermesAgent #Telegram #OpenSource #LLM #NousResearch #Codelab*
