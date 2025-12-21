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
- **OAuth Authentication** - Sign in with GitHub or Google via Better Auth
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
| Auth | [Better Auth](https://www.better-auth.com/) (GitHub, Google OAuth) |
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

6. **Start the development server**

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

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/laststance/npm-trend-clone)

Required environment variables:
- `DATABASE_URL` - Neon PostgreSQL connection string
- `DATABASE_URL_UNPOOLED` - Direct connection string for migrations
- `UPSTASH_REDIS_REST_URL` - Upstash Redis REST URL
- `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis REST token
- `BETTER_AUTH_SECRET` - Auth secret key
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` - GitHub OAuth credentials
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - Google OAuth credentials

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
