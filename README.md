# npm-trend-clone

[![Build](https://github.com/laststance/npm-trend-clone/actions/workflows/build.yml/badge.svg)](https://github.com/laststance/npm-trend-clone/actions/workflows/build.yml)
[![E2E Tests](https://github.com/laststance/npm-trend-clone/actions/workflows/e2e.yml/badge.svg)](https://github.com/laststance/npm-trend-clone/actions/workflows/e2e.yml)
[![Lint](https://github.com/laststance/npm-trend-clone/actions/workflows/lint.yml/badge.svg)](https://github.com/laststance/npm-trend-clone/actions/workflows/lint.yml)
[![Typecheck](https://github.com/laststance/npm-trend-clone/actions/workflows/typecheck.yml/badge.svg)](https://github.com/laststance/npm-trend-clone/actions/workflows/typecheck.yml)

A modern clone of [npmtrends.com](https://npmtrends.com/) built with Next.js 16, featuring npm package download statistics comparison and visualization.

## Acknowledgements

This project is inspired by and pays tribute to [npm trends](https://npmtrends.com/) created by [John Potter](https://github.com/johnmpotter). The original npm trends has been an invaluable tool for the JavaScript community, helping developers make informed decisions about package selection. We deeply appreciate the original work and aim to explore modern web development patterns while maintaining respect for the original project's vision.

## Features

- **Package Comparison** - Compare download trends of multiple npm packages
- **Interactive Charts** - Visualize download statistics with dynamic charts
- **OAuth Authentication** - Sign in with GitHub via Better Auth
- **Rate Limiting** - API protection with Upstash Redis
- **Dark Mode** - Full dark/light theme support
- **Responsive Design** - Mobile-friendly interface with shadcn/ui

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Database | [PostgreSQL](https://www.postgresql.org/) via [Neon](https://neon.tech/) |
| ORM | [Prisma 7](https://www.prisma.io/) |
| Cache | [Upstash Redis](https://upstash.com/) |
| Auth | [Better Auth](https://www.better-auth.com/) (GitHub OAuth) |
| UI | [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| State | [TanStack Query](https://tanstack.com/query) |
| Testing | [Playwright](https://playwright.dev/) (E2E), [Vitest](https://vitest.dev/) (Unit) |
| Mocking | [MSW](https://mswjs.io/) (Mock Service Worker) |
| Monitoring | [Sentry](https://sentry.io/) |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 22+
- [pnpm](https://pnpm.io/) 9+
- [Docker](https://www.docker.com/) (for local development)

### Local Development Setup

1. **Clone the repository**

```bash
git clone https://github.com/laststance/npm-trend-clone.git
cd npm-trend-clone
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Start local services with Docker Compose**

```bash
docker compose up -d
```

This starts:
- **PostgreSQL** (port 5433) - Local database
- **Redis** (port 6379) - Cache backend
- **SRH** (port 8079) - Upstash-compatible Redis HTTP API ([Serverless Redis HTTP](https://github.com/hiett/serverless-redis-http))

4. **Set up environment variables**

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration. For local development with Docker:

```env
# Database - Local PostgreSQL
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/npm_trend_clone?schema=public

# Redis - Local SRH (Upstash-compatible)
UPSTASH_REDIS_REST_URL=http://localhost:8079
UPSTASH_REDIS_REST_TOKEN=local_development_token

# Auth
BETTER_AUTH_SECRET=your-local-dev-secret
```

5. **Initialize the database**

```bash
pnpm prisma generate
pnpm prisma db push
```

6. **Seed the database** (required for auth testing)

```bash
pnpm db:seed
```

This creates a test account for local development:

| Field | Value |
|-------|-------|
| Email | `test@example.com` |
| Password | `testpassword123` |
| Name | `Test User` |

7. **Start the development server**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Docker Compose Services

| Service | Port | Description |
|---------|------|-------------|
| `postgres` | 5433 | PostgreSQL 16 database |
| `redis` | 6379 | Redis 7 cache server |
| `redis-http` | 8079 | [SRH](https://github.com/hiett/serverless-redis-http) - Upstash REST API compatible proxy |

> **Note**: SRH (Serverless Redis HTTP) is [officially recommended by Upstash](https://upstash.com/docs/redis/sdks/ts/developing) for local development. It provides an HTTP REST API in front of Redis, making the `@upstash/redis` SDK work seamlessly in local environments.

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with Turbopack |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm test` | Run unit tests with Vitest |
| `pnpm test:e2e` | Run E2E tests with Playwright |
| `pnpm db:seed` | Seed database with test account |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/          # Better Auth endpoints
│   │   ├── downloads/     # npm download statistics
│   │   ├── health/        # Health check endpoint
│   │   └── packages/      # Package info & search
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── settings/          # User settings
│   └── page.tsx           # Home page
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
│   ├── auth.ts           # Better Auth configuration
│   ├── redis.ts          # Upstash Redis client
│   └── utils.ts          # Helper functions
└── generated/            # Generated files (Prisma client)
```

## Testing

### Unit Tests

```bash
pnpm test
```

### E2E Tests

```bash
# Run in headless mode
pnpm test:e2e

# Run with UI
pnpm exec playwright test --ui
```

E2E tests use MSW (Mock Service Worker) for API mocking, ensuring consistent and reliable test results.

## GitHub OAuth Setup

To enable "Sign in with GitHub":

1. Go to **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**
2. Fill in:
   - **Application name**: `npm-trend-clone` (or your preferred name)
   - **Homepage URL**: `http://localhost:3000` (local) or your production URL
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
3. After creating, copy the **Client ID** and generate a **Client Secret**
4. Add to `.env.local`:
   ```env
   GITHUB_CLIENT_ID=your-client-id
   GITHUB_CLIENT_SECRET=your-client-secret
   ```

For production deployment, create a **separate** OAuth App with:
- **Homepage URL**: `https://your-production-domain.com`
- **Authorization callback URL**: `https://your-production-domain.com/api/auth/callback/github`

> **Note**: Better Auth handles the OAuth callback at `/api/auth/callback/github`. Ensure the callback URL matches exactly.

## Email Delivery (Resend)

Password reset and email verification use [Resend](https://resend.com/) for email delivery.

**Local development**: When `RESEND_API_KEY` is not set, emails are logged to the console instead of being sent.

**Production setup**:

1. Create a [Resend](https://resend.com/) account
2. Verify a sender domain (or use the free `onboarding@resend.dev` for testing)
3. Generate an API key
4. Add to your environment:
   ```env
   RESEND_API_KEY=re_your_api_key_here
   EMAIL_FROM=npm-trends <noreply@yourdomain.com>
   ```

> **Note**: Without `RESEND_API_KEY` set in production, auth email features (password reset, email verification) will silently fail to deliver.

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/laststance/npm-trend-clone)

### Environment Variables & Secrets

| Variable | Local | CI (Build) | Production | Required | Description |
|----------|:-----:|:----------:|:----------:|:--------:|-------------|
| `DATABASE_URL` | `.env.local` | Secret | Vercel env | Yes | Neon PostgreSQL pooled connection string |
| `DATABASE_URL_UNPOOLED` | — | Secret | Vercel env | Yes | Direct connection for migrations (non-pooled) |
| `UPSTASH_REDIS_REST_URL` | `.env.local` | Secret | Vercel env | Yes | Upstash Redis REST endpoint |
| `UPSTASH_REDIS_REST_TOKEN` | `.env.local` | Secret | Vercel env | Yes | Upstash Redis REST token |
| `BETTER_AUTH_SECRET` | `.env.local` | Secret | Vercel env | Yes | Auth encryption secret (min 32 chars) |
| `GITHUB_CLIENT_ID` | `.env.local` | Secret | Vercel env | Yes | GitHub OAuth App client ID |
| `GITHUB_CLIENT_SECRET` | `.env.local` | Secret | Vercel env | Yes | GitHub OAuth App client secret |
| `RESEND_API_KEY` | Optional | — | Vercel env | Yes | Resend API key for email delivery |
| `EMAIL_FROM` | Optional | — | Vercel env | Yes | Sender address (e.g., `noreply@yourdomain.com`) |
| `NEON_API_KEY` | — | Secret | — | No | Neon API key for migration backup branches |
| `NEON_PROJECT_ID` | — | Secret | — | No | Neon project ID for backup branch creation |
| `NEXT_PUBLIC_ENABLE_MSW_MOCK` | `.env.local` | — | — | No | Enable MSW mocking (`true`/`false`) |

**GitHub Actions secrets** (set in repo Settings → Secrets → Actions):
- Required: `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `BETTER_AUTH_SECRET`, `OAUTH_GITHUB_CLIENT_ID`, `OAUTH_GITHUB_CLIENT_SECRET`
- Optional (migration workflow): `NEON_API_KEY`, `NEON_PROJECT_ID` — when set, the db-migrate workflow creates a Neon backup branch before running `prisma migrate deploy`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Related Links

- [npm trends](https://npmtrends.com/) - The original inspiration
- [npm Registry API](https://github.com/npm/registry/blob/main/docs/REGISTRY-API.md) - npm API documentation
