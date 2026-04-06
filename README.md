# Naztify
A private real-time mood messenger for two people

## What it does

- Sender view for manually sending mood messages
- Receiver view for seeing the latest message and replying
- Simple polling-based sync with no push notifications or app store setup

## Run locally

```bash
npm install
npm start
```

The app runs on `http://localhost:3000` by default.

## Deploy on Render

- Create a new Web Service
- Render can use the included `render.yaml`, or you can set:
- Build command: `npm install`
- Start command: `npm start`

## Routes

- `/` landing page
- `/sender` sender view
- `/receiver` receiver view
- `/api/send` send a mood
- `/api/reply` reply to a mood
- `/api/latest` latest message for receiver
- `/api/status` latest message status for sender
