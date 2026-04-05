# Naztify-
# Couple Connect

A lightweight, real-time private messaging web app that enables instant mood-based push notifications between two users — with a beautiful response system built for mobile.

## Features

- 💌 **Mood-based notifications** — send predefined emotional states with one tap
- 🔔 **Push notifications** — powered by OneSignal Web Push API
- 💬 **Two-way reply system** — recipient can respond with contextual reply buttons
- 📱 **Mobile-first PWA** — works as a Home Screen app on iOS and Android
- 🎨 **Custom animations** — unique waiting state with animated character
- ⚡ **Real-time polling** — messages and replies appear instantly without page refresh
- 🔒 **Private by design** — no public profiles, no accounts, direct peer-to-peer feel

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Build**: esbuild
- **Push Notifications**: OneSignal Web Push
- **Frontend**: Vanilla HTML/CSS/JS (no framework)
- **Storage**: JSON file-based persistence

## Architecture

```
/dashboard   → Sender interface (mood buttons + custom message)
/her         → Receiver interface (message display + reply buttons)
/api/send    → POST: send a mood notification
/api/reply   → POST: submit a reply
/api/latest  → GET: poll for latest message
/api/status  → GET: poll for reply status
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 8080) |
| `ONESIGNAL_APP_ID` | OneSignal application ID |
| `ONESIGNAL_REST_API_KEY` | OneSignal REST API key |
| `APP_URL` | Public URL of deployed app |

## Getting Started

### Prerequisites
- Node.js 18+
- OneSignal account (free)

### Installation

```bash
# Install dependencies
npm install

# Build
node build.mjs

# Start
PORT=8080 node dist/index.mjs
```

### Deployment

This app is designed to be deployed on any Node.js hosting platform:

- **Render** — recommended (free tier available)
- **Railway**
- **Fly.io**

Set the environment variables in your hosting platform's dashboard.

## Usage

1. **Sender** opens `/dashboard` and saves it to Home Screen
2. **Receiver** opens `/her`, enables notifications, and saves to Home Screen
3. Sender taps a mood button → receiver gets a push notification
4. Receiver opens the app → sees the message → taps a reply button
5. Sender sees the reply appear on their dashboard in real time

## License

MIT
