# Pastebin Lite

A minimal Pastebin-like service built as a take-home assignment.

---

## ✨ Features

- Create pastes with optional expiration time (TTL)
- Limit number of views per paste
- Public HTML page to view pastes
- Persistent storage using Redis
- Deterministic time handling for automated tests

---

## 🛠 Tech Stack

- Next.js (App Router)
- TypeScript
- Upstash Redis
- Deployed on Vercel

---

## 📡 API Endpoints

### Health Check

```
GET /api/healthz
```

**Response**
```json
{ "ok": true }
```

---

### Create Paste

```
POST /api/pastes
```

**Request Body**
```json
{
  "content": "Hello world",
  "ttl_seconds": 60,
  "max_views": 3
}
```

**Response**
```json
{
  "id": "abc123",
  "url": "https://<deployment-url>/p/abc123"
}
```

**Notes**
1. `content` is required and must be a non-empty string  
2. `ttl_seconds` is optional (must be a positive integer)  
3. `max_views` is optional (must be a positive integer)

---

### Get Paste (API)

```
GET /api/pastes/:id
```

**Response**
```json
{
  "content": "Hello world",
  "remaining_views": 2,
  "expires_at": null
}
```

**Behavior**
1. Returns HTTP `404` if the paste does not exist  
2. Returns HTTP `404` if the paste is expired  
3. Returns HTTP `404` if the view limit is exceeded  
4. Each successful request consumes one view

---

## 🌐 Public Paste Page

```
GET /p/:id
```

- Renders paste content as HTML
- Content is safely escaped (no JavaScript execution)
- Returns a 404 page if the paste is expired or unavailable
- View count is enforced using the same API logic

---

## ⏱ Time Handling (Important)

When the environment variable below is enabled:

```
TEST_MODE=1
```

The application reads the request header:

```
x-test-now-ms
```

This allows deterministic control of time for automated tests, especially for validating expiration behavior.

---

## 🗄 Persistence

- Redis is used to persist paste data
- Ensures data survives across requests and serverless executions
- Each paste stores:
  - content
  - creation time
  - expiration time
  - maximum views
  - views consumed

---

## 🚀 Running Locally

### 1. Install dependencies
```bash
npm install
```

### 2. Create `.env.local`
```env
UPSTASH_REDIS_REST_URL=<your-redis-url>
UPSTASH_REDIS_REST_TOKEN=<your-redis-token>
NEXT_PUBLIC_BASE_URL=http://localhost:3000
TEST_MODE=1
```

### 3. Start development server
```bash
npm run dev
```

Open in browser:
```
http://localhost:3000
```

---

## 🌍 Deployment

- The application is deployed on **Vercel**
- Environment variables are configured in the Vercel dashboard
- Uses the same Redis instance in production
- `NEXT_PUBLIC_BASE_URL` is set to the deployed Vercel URL
