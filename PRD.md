# npm-trend-clone PRD (Product Requirements Document)

> **Version**: 2.0 (Post-Review Iteration 1-9)
> **Last Updated**: 2025-12-20
> **Status**: Review - Iteration 9/27
> **Review Agents**: Architecture, Security, UX, API, Data Model, Frontend, Testing, Requirements, TypeScript

---

## 1. Executive Summary

### 1.1 Product Vision
npm-trend-cloneは、npmパッケージのダウンロード統計を視覚的に比較・分析できるWebアプリケーションです。npmtrends.comにインスパイアされつつ、より高度なテーマカスタマイズ機能とユーザーパーソナライゼーションを提供します。

### 1.2 Problem Statement
開発者がnpmパッケージを選定する際、以下の課題があります：
- 複数パッケージの人気度を時系列で比較することが困難
- 類似パッケージ間の採用トレンドを把握しにくい
- お気に入りの比較セットを保存・共有できない
- 視覚的なカスタマイズ性が限られている

### 1.3 Solution Overview
- 最大6パッケージの時系列ダウンロード数比較チャート
- 124種類の色彩理論ベーステーマ + ランダムテーマモード
- ユーザー認証によるプリセット保存機能
- 共有可能なURL（/react-vs-vue-vs-angular形式）

### 1.4 Success Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| ページロード時間 | < 2秒 | Lighthouse |
| チャート描画時間 | < 500ms | Performance API |
| API応答時間 | < 200ms（キャッシュ時） | Server logs |
| アクセシビリティスコア | > 95 | Lighthouse |
| テストカバレッジ | > 80% | Vitest |

### 1.5 User Personas

#### Persona 1: Frontend Developer (Primary)
- **名前**: Takeshi, 28歳
- **役職**: フロントエンドエンジニア
- **経験**: 3-5年
- **ゴール**: React vs Vue vs Svelte などのフレームワーク選定
- **ペイン**: 複数サイトを行き来して情報収集する手間
- **利用頻度**: 週1-2回、プロジェクト開始時
- **期待機能**: 高速検索、視覚的な比較、URLでの共有

#### Persona 2: Tech Lead (Secondary)
- **名前**: Yuki, 35歳
- **役職**: テックリード
- **経験**: 8年以上
- **ゴール**: チーム向けの技術選定レポート作成
- **ペイン**: データ収集と可視化の時間的コスト
- **利用頻度**: 月2-3回、四半期レビュー時
- **期待機能**: プリセット保存、長期トレンド分析、エクスポート

#### Persona 3: OSS Maintainer (Tertiary)
- **名前**: Alex, 32歳
- **役職**: OSSメンテナー
- **経験**: 5年
- **ゴール**: 自身のライブラリの採用状況モニタリング
- **ペイン**: 競合との比較分析
- **利用頻度**: 週1回、定期チェック
- **期待機能**: 時系列での成長可視化、複数パッケージの同時比較

---

## 2. Technical Stack

### 2.1 Core Framework
| Category | Technology | Version | Rationale |
|----------|------------|---------|-----------|
| Framework | Next.js | 16.x | App Router, RSC, Server Actions |
| Language | TypeScript | 5.x | Type safety, developer experience |
| Runtime | Node.js | 22.x LTS | Latest stable features |

### 2.2 Frontend
| Category | Technology | Rationale |
|----------|------------|-----------|
| UI Components | shadcn/ui | Accessible, customizable, Tailwind-native |
| Styling | Tailwind CSS v4 | Utility-first, design tokens |
| Charts | Recharts | React-native, declarative, time-series優秀 |
| Forms | react-hook-form + zod | Performance, validation, type inference |
| State (Server) | RTK-Query + axios | Caching, refetching, devtools |
| State (URL) | nuqs | Type-safe URL state management |
| Pattern Matching | ts-pattern | Exhaustive matching, type safety |
| Toast | sonner | Modern, accessible, customizable |

### 2.3 Backend
| Category | Technology | Rationale |
|----------|------------|-----------|
| API Routes | Next.js Route Handlers | Co-located with app |
| ORM | Prisma | Type-safe, migrations, great DX |
| Database | Vercel Postgres | Serverless, Vercel integration |
| Cache | Upstash Redis | Serverless Redis, global edge caching |
| Auth | better-auth | Modern, flexible, Email/Password |
| Email | Resend | Developer-friendly, React Email |

### 2.4 Testing & Quality
| Category | Technology | Purpose |
|----------|------------|---------|
| Unit Tests | Vitest | Fast, ESM-native, Jest-compatible |
| E2E Tests | Playwright | Cross-browser, reliable |
| API Mocking | MSW | Service worker based, universal |
| Component Docs | Storybook v10 | Visual testing, documentation |
| Monitoring | Sentry | Error tracking, performance |

### 2.5 Infrastructure
| Category | Technology | Rationale |
|----------|------------|-----------|
| Hosting | Vercel | Next.js optimal, edge functions |
| CI/CD | GitHub Actions | Automation, integration |
| Package Manager | pnpm | Fast, disk efficient |

### 2.6 Development Tooling (Laststance.io Stack)

| Category | Package/Config | Source | Purpose |
|----------|----------------|--------|---------|
| Code Formatter | prettier-husky-lint-staged-installer | [GitHub](https://github.com/laststance/prettier-husky-lint-staged-installer) | Prettier + Husky + lint-staged 自動セットアップ |
| ESLint Config | eslint-config-ts-prefixer | [GitHub](https://github.com/laststance/eslint-config-ts-prefixer) | TypeScript向け厳格なESLint設定 |
| MSW Integration | next-msw-integration | [GitHub](https://github.com/laststance/next-msw-integration) | Next.js + MSW統合テンプレート |

#### 2.6.1 Formatter Setup (prettier-husky-lint-staged-installer)
```bash
# 自動セットアップ (pnpm)
pnpx prettier-husky-lint-staged-installer

# 以下が自動設定される:
# - prettier (コードフォーマット)
# - husky (Git hooks)
# - lint-staged (ステージファイルのみリント)
# - pre-commit hook (.husky/pre-commit)
```

**自動生成される設定:**
```json
// package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx,json,md}": ["prettier --write"]
  }
}
```

#### 2.6.2 ESLint Configuration (eslint-config-ts-prefixer)
```bash
pnpm add -D eslint-config-ts-prefixer
```

```javascript
// eslint.config.js (Flat Config)
import tsPrefix from 'eslint-config-ts-prefixer';

export default [
  ...tsPrefix,
  {
    rules: {
      // Project-specific overrides
    },
  },
];
```

**含まれる設定:**
- TypeScript strict rules
- React/React Hooks rules
- Import order sorting
- Accessibility (jsx-a11y)
- Prettier integration

#### 2.6.3 MSW Setup (next-msw-integration pattern)
```typescript
// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('https://api.npmjs.org/downloads/range/*', () => {
    return HttpResponse.json({
      downloads: [{ day: '2024-01-01', downloads: 1000000 }],
      start: '2024-01-01',
      end: '2024-12-31',
      package: 'react',
    });
  }),
];

// src/mocks/browser.ts
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

// src/mocks/server.ts (for tests)
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

**Next.js Integration:**
```typescript
// src/app/layout.tsx
import { MSWProvider } from '@/components/MSWProvider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <MSWProvider>{children}</MSWProvider>
      </body>
    </html>
  );
}

// src/components/MSWProvider.tsx
'use client';

import { useEffect, useState } from 'react';

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('@/mocks/browser').then(({ worker }) => {
        worker.start({ onUnhandledRequest: 'bypass' });
        setReady(true);
      });
    } else {
      setReady(true);
    }
  }, []);

  if (!ready) return null;
  return <>{children}</>;
}
```

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           Client Layer                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐  │
│  │PackageSearch│  │DownloadChart│  │ThemeProvider│  │PresetList │  │
│  │ (Combobox)  │  │ (Recharts)  │  │(124 themes) │  │  (CRUD)   │  │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └─────┬─────┘  │
│         │                │                │               │         │
│  ┌──────┴────────────────┴────────────────┴───────────────┴──────┐  │
│  │           RTK-Query Store + nuqs URL State                     │  │
│  └────────────────────────────┬──────────────────────────────────┘  │
└───────────────────────────────┼─────────────────────────────────────┘
                                │ HTTPS
┌───────────────────────────────┼─────────────────────────────────────┐
│                         Next.js App Router                           │
│  ┌────────────────────────────┼────────────────────────────────────┐│
│  │                    API Routes Layer                              ││
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐ ││
│  │  │/api/downloads│  │/api/packages │  │/api/presets            │ ││
│  │  │ (npm proxy)  │  │(search/info) │  │(auth required CRUD)    │ ││
│  │  └──────┬───────┘  └──────┬───────┘  └────────────┬───────────┘ ││
│  │         │                 │                       │              ││
│  │  ┌──────┴─────────────────┴───────────────────────┴────────────┐││
│  │  │                    Service Layer                             │││
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │││
│  │  │  │NpmApiService│  │CacheService │  │  PresetService      │  │││
│  │  │  │(chunking,   │  │(Upstash)    │  │  (Prisma)           │  │││
│  │  │  │rate limit)  │  │             │  │                     │  │││
│  │  │  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │││
│  │  └─────────┼────────────────┼───────────────────┬┴─────────────┘││
│  └────────────┼────────────────┼───────────────────┼───────────────┘│
└───────────────┼────────────────┼───────────────────┼────────────────┘
                │                │                   │
      ┌─────────┴────┐    ┌──────┴──────┐    ┌──────┴──────┐
      │   npm API    │    │Upstash Redis│    │Vercel Postgres│
      │(registry.npmjs)│   │   (Cache)   │    │   (Prisma)   │
      └──────────────┘    └─────────────┘    └──────────────┘
```

### 3.2 Data Flow

```
User Action: Search "react"
     │
     ▼
┌────────────────────────────────────────────────────────────────┐
│ 1. PackageSearch Component                                      │
│    - Debounced input (300ms)                                   │
│    - RTK-Query: useSearchPackagesQuery("react")                │
└────────────────────┬───────────────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────────────┐
│ 2. API Route: /api/packages/search                              │
│    - Check Upstash Redis cache                                  │
│    - If miss: fetch from npm registry                          │
│    - Cache result for 24 hours                                  │
└────────────────────┬───────────────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────────────┐
│ 3. User selects "react" → URL updates to /react                 │
│    - nuqs syncs state to URL                                    │
│    - RTK-Query: useGetDownloadsQuery(["react"])                │
└────────────────────┬───────────────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────────────┐
│ 4. API Route: /api/downloads                                    │
│    - Parse date range (default: 2 years)                       │
│    - Chunk into 365-day segments                                │
│    - Check cache for each chunk                                 │
│    - Fetch missing chunks from npm API (with rate limiting)    │
│    - Merge and return                                           │
└────────────────────┬───────────────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────────────┐
│ 5. DownloadChart renders Recharts LineChart                     │
│    - Responsive container                                       │
│    - Tooltip with exact values                                  │
│    - Legend with toggle                                         │
└────────────────────────────────────────────────────────────────┘
```

### 3.3 Resilience Patterns

#### 3.3.1 Circuit Breaker Pattern
```typescript
interface CircuitBreakerConfig {
  failureThreshold: 5;        // Failures before opening
  successThreshold: 2;        // Successes before closing
  timeout: 30000;             // Timeout in open state (ms)
  monitoringWindow: 60000;    // Window for failure counting (ms)
}

type CircuitState = 'closed' | 'open' | 'half-open';

// npm API calls are wrapped with circuit breaker
const npmApiCircuit = createCircuitBreaker({
  name: 'npm-api',
  ...circuitBreakerConfig,
  fallback: () => cachedResponse ?? errorResponse,
});
```

#### 3.3.2 Retry Strategy
```typescript
interface RetryConfig {
  maxRetries: 3;
  baseDelay: 1000;           // 1 second
  maxDelay: 10000;           // 10 seconds
  backoffMultiplier: 2;      // Exponential backoff
  retryCondition: (error: Error) => boolean;
}

// Retry only transient failures
const retryableErrors = [
  'ECONNRESET',
  'ETIMEDOUT',
  'ENOTFOUND',
  'RATE_LIMITED',
];
```

#### 3.3.3 Graceful Degradation
| Failure Scenario | Fallback Behavior |
|------------------|-------------------|
| npm API down | Show cached data with "stale" indicator |
| Rate limited | Queue requests, show loading with ETA |
| Partial data | Render available packages, skip failed |
| KV cache down | Fall through to npm API directly |
| Database down | Disable preset features, core works |

#### 3.3.4 Health Check Endpoints
```typescript
// GET /api/health
interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  services: {
    npmApi: ServiceHealth;
    database: ServiceHealth;
    cache: ServiceHealth;
  };
  version: string;
}

interface ServiceHealth {
  status: 'up' | 'down' | 'degraded';
  latency?: number;
  lastCheck: string;
}
```

---

## 4. Feature Specifications

### 4.1 Package Search & Selection

#### 4.1.1 Search Autocomplete
- **Input**: Combobox with debounced search (300ms)
- **API**: npm registry search endpoint
- **Results**: Top 10 matches with package name, description, weekly downloads
- **Keyboard**: Arrow navigation, Enter to select, Escape to close

#### 4.1.2 Package Tags
- **Display**: Horizontal list of selected packages
- **Color**: Auto-assigned from theme palette (unique per package)
- **Actions**: Remove button (×), click to highlight in chart
- **Limit**: Maximum 6 packages simultaneously

#### 4.1.3 URL State Sync
- **Format**: `/react-vs-vue-vs-angular` (hyphen-separated)
- **Scoped packages**: `@angular/core` → `@angular-core` (slash to hyphen)
- **Validation**: Invalid package names show error toast
- **History**: Browser back/forward works correctly

### 4.2 Download Statistics Chart

#### 4.2.1 Chart Configuration
```typescript
interface ChartConfig {
  type: 'line';
  xAxis: {
    dataKey: 'date';
    tickFormatter: (date: string) => string; // e.g., "Jan 2024"
  };
  yAxis: {
    tickFormatter: (value: number) => string; // e.g., "10M"
    domain: ['auto', 'auto'];
  };
  tooltip: {
    formatter: (value: number) => string; // e.g., "10,234,567"
    labelFormatter: (date: string) => string; // e.g., "January 15, 2024"
  };
  legend: {
    verticalAlign: 'top';
    onClick: (entry: LegendPayload) => void; // Toggle visibility
  };
}
```

#### 4.2.2 Time Range Selector
| Option | Period | Data Points | API Calls |
|--------|--------|-------------|-----------|
| 1Y | 1 year | ~365 | 1 |
| 2Y | 2 years | ~730 | 2 |
| 5Y | 5 years | ~1825 | 5 |
| Max | Since 2015 | ~3650 | 10 |

#### 4.2.3 Data Aggregation
- **Daily**: Raw data points (default for < 1 year)
- **Weekly**: Aggregated for 1-2 years
- **Monthly**: Aggregated for > 2 years
- **User toggle**: Allow switching aggregation level

### 4.3 Package Information Card

#### 4.3.1 Displayed Data
| Field | Source | Update Frequency |
|-------|--------|------------------|
| Weekly Downloads | npm API | 1 hour |
| GitHub Stars | npm registry | 24 hours |
| Latest Version | npm registry | Real-time |
| Last Published | npm registry | Real-time |
| License | npm registry | 24 hours |
| Homepage | npm registry | 24 hours |
| Repository | npm registry | 24 hours |

#### 4.3.2 Layout
```
┌─────────────────────────────────────────┐
│ react                           v18.3.1 │
│ ★ 228,000  ↓ 24.5M/week                │
│ MIT License                             │
│ Last published: 2 days ago              │
│ [GitHub] [npm] [Homepage]               │
└─────────────────────────────────────────┘
```

### 4.4 Authentication System

#### 4.4.1 Auth Methods
- **Email/Password**: Primary method via better-auth
- **Email Verification**: Required via Resend
- **Password Reset**: Email-based flow

#### 4.4.2 User Model
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified DateTime?
  name          String?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  presets       Preset[]
  sessions      Session[]
  accounts      Account[]
}
```

#### 4.4.3 Protected Routes
| Route | Auth Required | Description |
|-------|---------------|-------------|
| `/` | No | Main comparison page |
| `/[packages]` | No | Shareable comparison |
| `/presets` | Yes | Manage saved presets |
| `/settings` | Yes | User settings |
| `/api/presets/*` | Yes | Preset CRUD API |

### 4.5 Preset System

#### 4.5.1 Preset Model
```prisma
model Preset {
  id          String   @id @default(cuid())
  name        String
  packages    String[] // ["react", "vue", "@angular/core"]
  timeRange   String   @default("2Y") // "1Y" | "2Y" | "5Y" | "Max"
  themeId     String?  // Reference to theme
  isPublic    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}
```

#### 4.5.2 Preset Operations
| Operation | Endpoint | Auth | Description |
|-----------|----------|------|-------------|
| Create | POST /api/presets | Yes | Save current selection |
| List | GET /api/presets | Yes | User's presets |
| Get | GET /api/presets/[id] | Yes* | Get specific preset |
| Update | PATCH /api/presets/[id] | Yes | Modify preset |
| Delete | DELETE /api/presets/[id] | Yes | Remove preset |

*Public presets can be viewed without auth

### 4.6 Theme System

#### 4.6.1 Theme Structure
```typescript
interface Theme {
  id: string;
  name: string;
  category: ThemeCategory;
  colors: {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
    accent: string;
    muted: string;
    border: string;
    chart: string[]; // 6 colors for chart lines
  };
}

type ThemeCategory =
  | 'complementary'      // 24 themes
  | 'analogous'          // 24 themes
  | 'triadic'            // 24 themes
  | 'split-complementary' // 24 themes
  | 'monochromatic'      // 24 themes
  | 'custom';            // 4 themes
```

#### 4.6.2 Theme Categories (124 Total)
| Category | Count | Description |
|----------|-------|-------------|
| Complementary | 24 | Opposite colors on wheel |
| Analogous | 24 | Adjacent colors on wheel |
| Triadic | 24 | Three evenly spaced colors |
| Split-Complementary | 24 | Base + two adjacent to complement |
| Monochromatic | 24 | Single hue variations |
| Custom | 4 | Hand-crafted special themes |

#### 4.6.3 Random Theme Mode
```typescript
interface RandomThemeConfig {
  enabled: boolean;
  interval: 1000; // milliseconds
  transition: {
    property: 'all';
    duration: '0.5s';
    timingFunction: 'ease-in-out';
  };
  excludeCategories?: ThemeCategory[];
}
```

---

## 5. API Specifications

### 5.1 npm API Integration

#### 5.1.1 Download Statistics
```typescript
// GET /api/downloads?packages=react,vue&start=2023-01-01&end=2024-01-01

interface DownloadRequest {
  packages: string[];    // Max 6
  start: string;         // YYYY-MM-DD
  end: string;           // YYYY-MM-DD
  aggregation?: 'daily' | 'weekly' | 'monthly';
}

interface DownloadResponse {
  data: {
    [packageName: string]: {
      downloads: Array<{
        date: string;
        downloads: number;
      }>;
      total: number;
    };
  };
  meta: {
    start: string;
    end: string;
    aggregation: string;
    cached: boolean;
    fetchedAt: string;
  };
}
```

#### 5.1.2 Package Search
```typescript
// GET /api/packages/search?q=react&limit=10

interface SearchResponse {
  results: Array<{
    name: string;
    description: string;
    version: string;
    weeklyDownloads: number;
    score: {
      final: number;
      detail: {
        quality: number;
        popularity: number;
        maintenance: number;
      };
    };
  }>;
  total: number;
}
```

#### 5.1.3 Package Info
```typescript
// GET /api/packages/[name]

interface PackageInfoResponse {
  name: string;
  version: string;
  description: string;
  license: string;
  homepage: string;
  repository: {
    type: string;
    url: string;
  };
  weeklyDownloads: number;
  lastPublished: string;
  maintainers: Array<{
    name: string;
    email: string;
  }>;
}
```

### 5.2 Preset API

#### 5.2.1 Create Preset
```typescript
// POST /api/presets
// Auth: Required

interface CreatePresetRequest {
  name: string;
  packages: string[];
  timeRange: '1Y' | '2Y' | '5Y' | 'Max';
  themeId?: string;
  isPublic?: boolean;
}

interface CreatePresetResponse {
  id: string;
  name: string;
  packages: string[];
  timeRange: string;
  themeId: string | null;
  isPublic: boolean;
  createdAt: string;
}
```

#### 5.2.2 List Presets
```typescript
// GET /api/presets
// Auth: Required

interface ListPresetsResponse {
  presets: Array<{
    id: string;
    name: string;
    packages: string[];
    timeRange: string;
    themeId: string | null;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
  }>;
  total: number;
}
```

### 5.3 Auth API (better-auth)

#### 5.3.1 Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/auth/signup | POST | Create account |
| /api/auth/signin | POST | Login |
| /api/auth/signout | POST | Logout |
| /api/auth/session | GET | Get current session |
| /api/auth/verify-email | POST | Verify email |
| /api/auth/forgot-password | POST | Request password reset |
| /api/auth/reset-password | POST | Reset password |

### 5.4 Standardized API Response Envelope

#### 5.4.1 Success Response
```typescript
interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    timestamp: string;
    requestId: string;
    cached?: boolean;
    cacheAge?: number;
  };
}
```

#### 5.4.2 Error Response
```typescript
interface ApiErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: Record<string, unknown>;
    validationErrors?: ValidationError[];
  };
  meta: {
    timestamp: string;
    requestId: string;
  };
}

type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'PACKAGE_NOT_FOUND'
  | 'RATE_LIMITED'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'INTERNAL_ERROR'
  | 'SERVICE_UNAVAILABLE'
  | 'INVALID_DATE_RANGE'
  | 'MAX_PACKAGES_EXCEEDED';

interface ValidationError {
  field: string;
  message: string;
  code: string;
}
```

#### 5.4.3 Pagination Response
```typescript
interface PaginatedResponse<T> extends ApiSuccessResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Usage example: GET /api/presets?page=1&pageSize=10
```

### 5.5 RTK-Query Integration Patterns

```typescript
// lib/store/api/baseApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      // Add auth token if available
      return headers;
    },
  }),
  tagTypes: ['Downloads', 'Packages', 'Presets'],
  endpoints: () => ({}),
});

// lib/store/api/downloadsApi.ts
export const downloadsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDownloads: builder.query<DownloadResponse, DownloadRequest>({
      query: ({ packages, start, end }) => ({
        url: '/downloads',
        params: { packages: packages.join(','), start, end },
      }),
      providesTags: (result, error, { packages }) =>
        packages.map((pkg) => ({ type: 'Downloads', id: pkg })),
    }),
  }),
});

export const { useGetDownloadsQuery } = downloadsApi;
```

---

## 6. Database Schema

### 6.1 Complete Prisma Schema
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// ============================================
// Authentication (better-auth)
// ============================================

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified DateTime?
  name          String?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  presets       Preset[]
  sessions      Session[]
  accounts      Account[]
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model Account {
  id                    String  @id @default(cuid())
  userId                String
  accountId             String
  providerId            String
  accessToken           String?
  refreshToken          String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  idToken               String?
  password              String?
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  user                  User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model Verification {
  id         String   @id @default(cuid())
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([identifier])
}

// ============================================
// Application Models
// ============================================

model Preset {
  id          String   @id @default(cuid())
  name        String
  packages    String[]
  timeRange   String   @default("2Y")
  themeId     String?
  isPublic    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([isPublic])
  @@index([userId, createdAt(sort: Desc)])  // User's presets sorted by date
  @@index([isPublic, createdAt(sort: Desc)]) // Public presets discovery
}

// ============================================
// Audit & Analytics (Optional Enhancement)
// ============================================

model AuditLog {
  id         String   @id @default(cuid())
  action     String   // auth.login, preset.create, etc.
  userId     String?
  ipAddress  String
  userAgent  String
  resource   String
  outcome    String   // success | failure
  metadata   Json?
  createdAt  DateTime @default(now())

  @@index([userId, createdAt(sort: Desc)])
  @@index([action, createdAt(sort: Desc)])
  @@index([createdAt(sort: Desc)])
}
```

### 6.2 Upstash Redis Key Conventions

```typescript
// Cache key patterns with TTL
const kvKeyPatterns = {
  // Downloads: Immutable historical data (7 days TTL)
  downloads: {
    pattern: 'dl:{package}:{startDate}:{endDate}',
    example: 'dl:react:2024-01-01:2024-12-31',
    ttl: 7 * 24 * 60 * 60, // 7 days
  },

  // Search: Semi-stable data (24 hours TTL)
  search: {
    pattern: 'search:{query}',
    example: 'search:react',
    ttl: 24 * 60 * 60, // 24 hours
  },

  // Package info: Frequent updates (1 hour TTL)
  packageInfo: {
    pattern: 'pkg:{package}',
    example: 'pkg:react',
    ttl: 60 * 60, // 1 hour
  },

  // Rate limiting: Short-lived (1 minute window)
  rateLimit: {
    pattern: 'rl:{ip}:{endpoint}',
    example: 'rl:192.168.1.1:downloads',
    ttl: 60, // 1 minute
  },
};
```

---

## 7. UI/UX Specifications

### 7.1 Layout Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│ Header                                                               │
│ ┌───────────────┐                          ┌─────┐ ┌─────┐ ┌─────┐ │
│ │ npm-trends    │                          │Theme│ │Login│ │ ☰   │ │
│ └───────────────┘                          └─────┘ └─────┘ └─────┘ │
├─────────────────────────────────────────────────────────────────────┤
│ Search Bar                                                           │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ 🔍 Search npm packages...                                        │ │
│ └─────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│ Package Tags                                                         │
│ ┌────────┐ ┌────────┐ ┌────────────────┐ ┌────────┐ ┌────────────┐ │
│ │ react ×│ │ vue  × │ │ @angular/core ×│ │svelte ×│ │ solid-js × │ │
│ └────────┘ └────────┘ └────────────────┘ └────────┘ └────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│ Time Range Selector                                                  │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐                                        │
│ │ 1Y │ │ 2Y │ │ 5Y │ │Max │                                        │
│ └────┘ └────┘ └────┘ └────┘                                        │
├─────────────────────────────────────────────────────────────────────┤
│ Chart Area                                                           │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │                                                                   │ │
│ │  60M ─┼─────────────────────────────────────────────────────    │ │
│ │       │                                              ┌─────      │ │
│ │  40M ─┼────────────────────────────────────────────┌┘           │ │
│ │       │                                        ┌───┘             │ │
│ │  20M ─┼───────────────────────────────────────┘                 │ │
│ │       │          ┌──────────────────────────────                 │ │
│ │   0  ─┼─────────┴────────────────────────────────────────────   │ │
│ │       2016   2018   2020   2022   2024                          │ │
│ └─────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│ Package Info Cards                                                   │
│ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐     │
│ │ react      v18.3 │ │ vue        v3.5  │ │ @angular/core    │     │
│ │ ★ 228K ↓ 24.5M  │ │ ★ 207K ↓ 5.2M   │ │ ★ 95K  ↓ 3.1M   │     │
│ └──────────────────┘ └──────────────────┘ └──────────────────┘     │
├─────────────────────────────────────────────────────────────────────┤
│ Footer                                                               │
│ Data from npm registry • GitHub • Made with ❤️                       │
└─────────────────────────────────────────────────────────────────────┘
```

### 7.2 Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | < 640px | Stack layout, swipe for tags |
| Tablet | 640-1024px | 2-column info cards |
| Desktop | > 1024px | Full layout as shown |

### 7.3 Loading States Matrix

| Component | Initial Load | Refetching | Error | Empty |
|-----------|--------------|------------|-------|-------|
| PackageSearch | Input skeleton | Spinner in dropdown | Toast + retry | "Start typing..." |
| DownloadChart | Chart skeleton with grid | Overlay spinner | Error boundary | "Add packages to compare" |
| PackageInfoCard | Card skeleton (3 lines) | Pulse animation | "Failed to load" + retry | N/A |
| PresetList | List skeleton (5 items) | Pull-to-refresh | Toast + retry | "No presets yet" |
| ThemeSelector | Grid skeleton | Fade transition | Default theme | N/A |

```typescript
// Skeleton variants for consistent loading states
type SkeletonVariant =
  | 'chart'      // Recharts placeholder with grid lines
  | 'card'       // Package info card shape
  | 'list'       // Vertical list items
  | 'search'     // Combobox dropdown items
  | 'tags';      // Horizontal tag row

// Loading state with progress indication
interface LoadingState {
  isLoading: boolean;
  progress?: number;        // 0-100 for chunked requests
  stage?: string;           // "Fetching 2024 data..."
  estimatedTime?: number;   // Seconds remaining
}
```

### 7.4 Accessibility Requirements

| Requirement | Implementation |
|-------------|----------------|
| Keyboard Navigation | Full tab navigation, arrow keys in menus |
| Screen Reader | ARIA labels, live regions for chart updates |
| Color Contrast | WCAG 2.2 AA minimum (4.5:1) |
| Reduced Motion | Respect `prefers-reduced-motion` |
| Focus Indicators | Visible focus rings (2px) |

#### 7.4.1 Screen Reader Announcements

```typescript
// Live region announcements for dynamic content
const announcements = {
  packageAdded: (name: string) => `${name} added to comparison`,
  packageRemoved: (name: string) => `${name} removed from comparison`,
  chartUpdated: (count: number) => `Chart updated with ${count} packages`,
  dataLoading: 'Loading download data...',
  dataLoaded: 'Download data loaded successfully',
  themeChanged: (theme: string) => `Theme changed to ${theme}`,
  error: (message: string) => `Error: ${message}`,
};

// ARIA live region component
<div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
  {announcement}
</div>
```

#### 7.4.2 Focus Management

```typescript
// Focus trap for modals and dialogs
interface FocusTrapConfig {
  initialFocus: 'first' | 'specific' | 'none';
  returnFocus: boolean;
  escapeDeactivates: boolean;
  clickOutsideDeactivates: boolean;
}

// Skip link for keyboard navigation
<a href="#main-content" className="skip-link">
  Skip to main content
</a>
```

### 7.5 Dark Mode (Default)

The application defaults to dark mode matching the reference design:
- Background: `#0a0a0a` (near black)
- Foreground: `#fafafa` (near white)
- Chart area: `#1a1a1a` (dark gray)
- Grid lines: `#333333` (subtle gray)

---

## 8. Caching Strategy

### 8.1 Cache Layers

```
Request
   │
   ▼
┌──────────────────────────────────────────┐
│ Layer 1: Browser Cache (RTK-Query)        │
│ - In-memory cache                         │
│ - Stale-while-revalidate                 │
│ - TTL: 5 minutes                          │
└────────────────────┬─────────────────────┘
                     │ Cache miss
                     ▼
┌──────────────────────────────────────────┐
│ Layer 2: Vercel Edge Cache                │
│ - CDN level caching                       │
│ - Geographic distribution                 │
│ - TTL: 1 hour (downloads), 24h (search)  │
└────────────────────┬─────────────────────┘
                     │ Cache miss
                     ▼
┌──────────────────────────────────────────┐
│ Layer 3: Upstash Redis (Serverless)       │
│ - Server-side cache                       │
│ - Persistent across deployments          │
│ - TTL: Configurable per key type         │
└────────────────────┬─────────────────────┘
                     │ Cache miss
                     ▼
┌──────────────────────────────────────────┐
│ Origin: npm API                           │
│ - Rate limited (200ms delay)             │
│ - Chunked requests                        │
└──────────────────────────────────────────┘
```

### 8.2 Cache Key Strategy

```typescript
const cacheKeys = {
  // Download data cache
  downloads: (pkg: string, start: string, end: string) =>
    `downloads:${pkg}:${start}:${end}`,

  // Package search cache
  search: (query: string) =>
    `search:${query.toLowerCase()}`,

  // Package info cache
  packageInfo: (pkg: string) =>
    `pkg:${pkg}`,
};
```

### 8.3 Cache TTL Configuration

| Data Type | TTL | Rationale |
|-----------|-----|-----------|
| Historical downloads (> 7 days ago) | 7 days | Immutable |
| Recent downloads (≤ 7 days) | 1 hour | Updates daily |
| Package search results | 24 hours | Relatively stable |
| Package info | 1 hour | Version updates |

---

## 9. Error Handling

### 9.1 Error Types

```typescript
type AppError =
  | { code: 'PACKAGE_NOT_FOUND'; package: string }
  | { code: 'RATE_LIMITED'; retryAfter: number }
  | { code: 'INVALID_DATE_RANGE'; message: string }
  | { code: 'MAX_PACKAGES_EXCEEDED'; limit: number }
  | { code: 'AUTH_REQUIRED'; redirect: string }
  | { code: 'NETWORK_ERROR'; message: string }
  | { code: 'UNKNOWN_ERROR'; message: string };
```

### 9.2 Error Display

| Error | User Message | Action |
|-------|--------------|--------|
| Package not found | "Package 'xyz' not found" | Remove from selection |
| Rate limited | "Too many requests, retrying..." | Auto-retry with backoff |
| Invalid date range | "Invalid date range selected" | Reset to default |
| Max packages | "Maximum 6 packages allowed" | Toast warning |
| Auth required | "Sign in to save presets" | Redirect to login |
| Network error | "Connection error, retrying..." | Auto-retry |

---

## 10. Security Considerations

### 10.1 Authentication Security

| Measure | Implementation |
|---------|----------------|
| Password Hashing | bcrypt with cost factor 12 |
| Session Management | HTTP-only, secure cookies |
| CSRF Protection | SameSite=Strict cookies |
| Rate Limiting | 5 login attempts per minute |

### 10.2 API Security

| Measure | Implementation |
|---------|----------------|
| Input Validation | Zod schema validation |
| Output Sanitization | No sensitive data in responses |
| CORS | Restrict to same origin |
| Rate Limiting | 100 requests per minute per IP |

### 10.3 Data Security

| Measure | Implementation |
|---------|----------------|
| Database | Encrypted at rest (Vercel Postgres) |
| Transport | TLS 1.3 only |
| Secrets | Environment variables, not in code |
| Audit Logging | Sentry for error tracking |

### 10.4 Enhanced Password Policy

```typescript
interface PasswordPolicy {
  minLength: 12;
  maxLength: 128;
  requirements: {
    lowercase: true;
    uppercase: true;
    numbers: true;
    specialChars: true;
  };
  specialChars: '!@#$%^&*()_+-=[]{}|;:,.<>?';
  commonPasswordCheck: true;    // Against top 10,000 list
  breachCheck: true;            // HaveIBeenPwned API (k-anonymity)
}

// Password strength meter feedback
type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong' | 'excellent';
```

### 10.5 Account Lockout Policy

| Trigger | Action | Duration |
|---------|--------|----------|
| 5 failed logins | Temporary lockout | 15 minutes |
| 10 failed logins | Extended lockout | 1 hour |
| 20 failed logins | Account disabled | Manual unlock required |

```typescript
// Lockout implementation
interface LockoutState {
  failedAttempts: number;
  lastFailedAt: Date;
  lockedUntil: Date | null;
  isDisabled: boolean;
}
```

### 10.6 Security Headers

```typescript
// Next.js middleware security headers
const securityHeaders = {
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    font-src 'self';
    connect-src 'self' https://api.npmjs.org https://registry.npmjs.org;
    frame-ancestors 'none';
  `,
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
};
```

### 10.7 Rate Limiting Matrix

| Endpoint Category | Unauthenticated | Authenticated | Notes |
|-------------------|-----------------|---------------|-------|
| `/api/downloads` | 60/min | 120/min | Core functionality |
| `/api/packages/search` | 30/min | 60/min | Debounced on client |
| `/api/auth/*` | 10/min | N/A | Strict for security |
| `/api/presets` | N/A | 100/min | Auth required |

```typescript
// Rate limit response
interface RateLimitResponse {
  error: 'RATE_LIMITED';
  retryAfter: number;       // Seconds until reset
  limit: number;            // Requests allowed
  remaining: number;        // Requests remaining
  reset: number;            // Unix timestamp of reset
}
```

### 10.8 Audit Logging

```typescript
interface AuditLog {
  id: string;
  timestamp: Date;
  action: AuditAction;
  userId?: string;
  ipAddress: string;
  userAgent: string;
  resource: string;
  outcome: 'success' | 'failure';
  metadata?: Record<string, unknown>;
}

type AuditAction =
  | 'auth.login'
  | 'auth.logout'
  | 'auth.signup'
  | 'auth.password_reset'
  | 'preset.create'
  | 'preset.update'
  | 'preset.delete'
  | 'rate_limit.exceeded';
```

---

## 11. Performance Requirements

### 11.1 Core Web Vitals Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| LCP (Largest Contentful Paint) | < 2.5s | Lighthouse |
| FID (First Input Delay) | < 100ms | Lighthouse |
| CLS (Cumulative Layout Shift) | < 0.1 | Lighthouse |
| TTFB (Time to First Byte) | < 200ms | Server logs |

### 11.2 Application Performance

| Metric | Target | Implementation |
|--------|--------|----------------|
| Initial bundle | < 150KB (gzip) | Code splitting |
| Chart render | < 500ms | Recharts optimization |
| Search response | < 200ms | Debouncing, caching |
| Theme switch | < 50ms | CSS variables |

---

## 12. Testing Strategy

### 12.1 Test Pyramid

```
          ┌─────────┐
          │   E2E   │  10% - Critical user journeys
          │Playwright│
         ─┴─────────┴─
        ┌─────────────┐
        │ Integration │  30% - API routes, hooks
        │   Vitest    │
       ─┴─────────────┴─
      ┌─────────────────┐
      │      Unit       │  60% - Components, utils
      │     Vitest      │
     ─┴─────────────────┴─
```

### 12.2 Test Coverage Targets

| Category | Target | Focus Areas |
|----------|--------|-------------|
| Unit Tests | 80% | Utils, hooks, pure components |
| Integration | 70% | API routes, data fetching |
| E2E | Critical paths | Search, chart, auth flows |

### 12.3 E2E Test Scenarios

| Scenario | Steps |
|----------|-------|
| Package Search | Type query → Select result → Verify URL update |
| Chart Comparison | Add 3 packages → Verify chart renders |
| Time Range | Switch 1Y → 5Y → Verify data refresh |
| Auth Flow | Sign up → Verify email → Login → Create preset |
| Preset Management | Create → List → Update → Delete |

---

## 13. Directory Structure

```
npm-trend-clone/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (main)/
│   │   ├── [packages]/
│   │   │   └── page.tsx
│   │   ├── presets/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...all]/
│   │   │       └── route.ts
│   │   ├── downloads/
│   │   │   └── route.ts
│   │   ├── packages/
│   │   │   ├── search/
│   │   │   │   └── route.ts
│   │   │   └── [name]/
│   │   │       └── route.ts
│   │   └── presets/
│   │       ├── route.ts
│   │       └── [id]/
│   │           └── route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── charts/
│   │   ├── DownloadChart.tsx
│   │   ├── ChartTooltip.tsx
│   │   └── ChartLegend.tsx
│   ├── package/
│   │   ├── PackageSearch.tsx
│   │   ├── PackageTags.tsx
│   │   └── PackageInfoCard.tsx
│   ├── preset/
│   │   ├── PresetList.tsx
│   │   ├── PresetCard.tsx
│   │   └── CreatePresetDialog.tsx
│   ├── theme/
│   │   ├── ThemeProvider.tsx
│   │   ├── ThemeSelector.tsx
│   │   └── RandomThemeToggle.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── MobileNav.tsx
│   └── ui/
│       └── (shadcn components)
├── lib/
│   ├── api/
│   │   ├── npm-client.ts
│   │   └── cache.ts
│   ├── auth/
│   │   └── config.ts
│   ├── db/
│   │   └── prisma.ts
│   ├── store/
│   │   ├── store.ts
│   │   └── api/
│   │       ├── downloadsApi.ts
│   │       ├── packagesApi.ts
│   │       └── presetsApi.ts
│   ├── themes/
│   │   ├── definitions.ts
│   │   └── generator.ts
│   ├── utils/
│   │   ├── date.ts
│   │   ├── format.ts
│   │   └── url.ts
│   └── validations/
│       └── schemas.ts
├── hooks/
│   ├── usePackageSearch.ts
│   ├── useDownloadData.ts
│   ├── useTheme.ts
│   └── usePresets.ts
├── types/
│   ├── npm.ts
│   ├── preset.ts
│   └── theme.ts
├── prisma/
│   └── schema.prisma
├── public/
│   └── (static assets)
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .storybook/
│   ├── main.ts
│   └── preview.ts
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 14. Development Phases

### Phase 1: Foundation (MVP Core)
- [x] Project setup (Next.js 16, TypeScript, Tailwind, shadcn/ui)
- [ ] Basic search and chart functionality
- [ ] URL state management
- [ ] npm API integration with caching
- [ ] Dark mode theme

### Phase 2: Enhanced Features
- [ ] Package info cards
- [ ] Time range selector
- [ ] Data aggregation options
- [ ] Error handling improvements

### Phase 3: Authentication & Persistence
- [ ] better-auth setup
- [ ] User registration/login
- [ ] Email verification (Resend)
- [ ] Protected routes

### Phase 4: Preset System
- [ ] Preset CRUD API
- [ ] Preset UI components
- [ ] Public preset sharing

### Phase 5: Theme System
- [ ] 124 theme definitions
- [ ] Theme selector UI
- [ ] Random theme mode
- [ ] Theme persistence

### Phase 6: Polish & Production
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] E2E test coverage
- [ ] Production deployment

---

## 15. Open Questions & Decisions

### 15.1 To Be Decided
| Question | Options | Decision |
|----------|---------|----------|
| Chart library details | Recharts vs Tremor | Recharts ✓ |
| Theme storage | CSS variables vs Tailwind | TBD |
| Preset limits | 10 vs 50 per user | TBD |
| Public preset discovery | Enable/disable | TBD |

### 15.2 Technical Debt Tracking
- [ ] Add comprehensive error boundaries
- [ ] Implement service worker for offline support
- [ ] Add analytics integration
- [ ] Consider WebSocket for real-time updates

---

## 16. TypeScript Type System

### 16.1 Core Type Definitions

```typescript
// types/npm.ts
export interface NpmPackage {
  name: string;
  version: string;
  description: string;
  keywords?: string[];
  license?: string;
  homepage?: string;
  repository?: {
    type: string;
    url: string;
  };
  maintainers?: Array<{
    name: string;
    email?: string;
  }>;
}

export interface DownloadDataPoint {
  date: string;        // YYYY-MM-DD format
  downloads: number;
}

export interface PackageDownloads {
  package: string;
  downloads: DownloadDataPoint[];
  total: number;
  start: string;
  end: string;
}

// types/theme.ts
export interface Theme {
  id: string;
  name: string;
  category: ThemeCategory;
  colors: ThemeColors;
}

export interface ThemeColors {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
  border: string;
  chart: readonly [string, string, string, string, string, string];
}

export type ThemeCategory =
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'split-complementary'
  | 'monochromatic'
  | 'custom';

// types/preset.ts
export interface Preset {
  id: string;
  name: string;
  packages: string[];
  timeRange: TimeRange;
  themeId: string | null;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export type TimeRange = '1Y' | '2Y' | '5Y' | 'Max';

export type Aggregation = 'daily' | 'weekly' | 'monthly';
```

### 16.2 Zod Validation Schemas

```typescript
// lib/validations/schemas.ts
import { z } from 'zod';

// Package name validation (supports scoped packages)
export const packageNameSchema = z
  .string()
  .min(1)
  .max(214)
  .regex(
    /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/,
    'Invalid package name format'
  );

// Download request validation
export const downloadRequestSchema = z.object({
  packages: z
    .array(packageNameSchema)
    .min(1, 'At least one package required')
    .max(6, 'Maximum 6 packages allowed'),
  start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  aggregation: z.enum(['daily', 'weekly', 'monthly']).optional(),
});

// Search request validation
export const searchRequestSchema = z.object({
  q: z.string().min(1).max(200),
  limit: z.coerce.number().min(1).max(50).default(10),
});

// Preset creation validation
export const createPresetSchema = z.object({
  name: z.string().min(1).max(100),
  packages: z.array(packageNameSchema).min(1).max(6),
  timeRange: z.enum(['1Y', '2Y', '5Y', 'Max']),
  themeId: z.string().optional(),
  isPublic: z.boolean().default(false),
});

// Auth schemas
export const signUpSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(12, 'Password must be at least 12 characters')
    .max(128)
    .regex(/[a-z]/, 'Must contain lowercase letter')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[0-9]/, 'Must contain number')
    .regex(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/, 'Must contain special character'),
  name: z.string().min(1).max(100).optional(),
});

// Type inference helpers
export type DownloadRequest = z.infer<typeof downloadRequestSchema>;
export type SearchRequest = z.infer<typeof searchRequestSchema>;
export type CreatePresetInput = z.infer<typeof createPresetSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
```

### 16.3 ts-pattern Integration

```typescript
// lib/utils/pattern-matching.ts
import { match, P } from 'ts-pattern';

// Error handling with exhaustive matching
export function handleApiError(error: ApiErrorResponse['error']) {
  return match(error.code)
    .with('PACKAGE_NOT_FOUND', () => ({
      title: 'Package Not Found',
      description: `The package "${error.details?.package}" could not be found.`,
      action: 'remove' as const,
    }))
    .with('RATE_LIMITED', () => ({
      title: 'Rate Limited',
      description: `Too many requests. Please wait ${error.details?.retryAfter}s.`,
      action: 'retry' as const,
    }))
    .with('VALIDATION_ERROR', () => ({
      title: 'Invalid Input',
      description: error.message,
      action: 'fix' as const,
    }))
    .with('UNAUTHORIZED', () => ({
      title: 'Authentication Required',
      description: 'Please sign in to continue.',
      action: 'login' as const,
    }))
    .with('FORBIDDEN', () => ({
      title: 'Access Denied',
      description: 'You do not have permission to perform this action.',
      action: 'none' as const,
    }))
    .with(P.union('INTERNAL_ERROR', 'SERVICE_UNAVAILABLE'), () => ({
      title: 'Service Error',
      description: 'Something went wrong. Please try again later.',
      action: 'retry' as const,
    }))
    .otherwise(() => ({
      title: 'Error',
      description: error.message,
      action: 'none' as const,
    }));
}

// Loading state pattern matching
export function renderLoadingState<T>(
  state: { isLoading: boolean; error?: Error; data?: T },
  render: {
    loading: () => React.ReactNode;
    error: (error: Error) => React.ReactNode;
    success: (data: T) => React.ReactNode;
    empty: () => React.ReactNode;
  }
) {
  return match(state)
    .with({ isLoading: true }, render.loading)
    .with({ error: P.not(undefined) }, ({ error }) => render.error(error))
    .with({ data: undefined }, render.empty)
    .with({ data: P.not(undefined) }, ({ data }) => render.success(data))
    .exhaustive();
}

// Time range configuration pattern
export function getTimeRangeConfig(range: TimeRange) {
  return match(range)
    .with('1Y', () => ({
      label: '1 Year',
      days: 365,
      aggregation: 'daily' as const,
      apiCalls: 1,
    }))
    .with('2Y', () => ({
      label: '2 Years',
      days: 730,
      aggregation: 'weekly' as const,
      apiCalls: 2,
    }))
    .with('5Y', () => ({
      label: '5 Years',
      days: 1825,
      aggregation: 'monthly' as const,
      apiCalls: 5,
    }))
    .with('Max', () => ({
      label: 'All Time',
      days: 3650,
      aggregation: 'monthly' as const,
      apiCalls: 10,
    }))
    .exhaustive();
}
```

### 16.4 Type Guards and Utilities

```typescript
// lib/utils/type-guards.ts

// Package name validation
export function isValidPackageName(name: unknown): name is string {
  if (typeof name !== 'string') return false;
  return /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(name);
}

// API response type guard
export function isApiError(
  response: ApiSuccessResponse<unknown> | ApiErrorResponse
): response is ApiErrorResponse {
  return response.success === false;
}

// Branded types for type safety
declare const __brand: unique symbol;
type Brand<B> = { [__brand]: B };

export type PackageName = string & Brand<'PackageName'>;
export type UserId = string & Brand<'UserId'>;
export type PresetId = string & Brand<'PresetId'>;

// Safe casting functions
export function toPackageName(name: string): PackageName | null {
  return isValidPackageName(name) ? (name as PackageName) : null;
}

// Result type for error handling
export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}
```

---

## Appendix A: npm API Reference

### A.1 Download Statistics API

**Point Endpoint (Aggregate)**
```
GET https://api.npmjs.org/downloads/point/{period}/{package}

Period: last-day | last-week | last-month | last-year | YYYY-MM-DD:YYYY-MM-DD
```

**Range Endpoint (Daily Breakdown)**
```
GET https://api.npmjs.org/downloads/range/{period}/{package}

Response:
{
  "downloads": [
    { "day": "2024-01-01", "downloads": 1234567 },
    ...
  ],
  "start": "2024-01-01",
  "end": "2024-12-31",
  "package": "react"
}
```

**Limitations:**
- Max 365 days per request
- Max 128 packages in bulk query
- Earliest data: 2015-01-10
- Scoped packages: URL encode slash (`@scope%2Fpackage`)

### A.2 Registry Search API

```
GET https://registry.npmjs.org/-/v1/search?text={query}&size={limit}

Response:
{
  "objects": [
    {
      "package": {
        "name": "react",
        "version": "18.3.1",
        "description": "...",
        "links": { "npm": "...", "homepage": "...", "repository": "..." }
      },
      "score": { "final": 0.95, "detail": { ... } }
    }
  ],
  "total": 1234
}
```

---

## Appendix B: Theme Color Palettes

### B.1 Complementary Themes (Sample)

| Theme ID | Base Hue | Complement | Chart Colors |
|----------|----------|------------|--------------|
| comp-001 | #3B82F6 (Blue) | #F6923B (Orange) | [#3B82F6, #F6923B, #60A5FA, #FB923C, #93C5FD, #FDBA74] |
| comp-002 | #10B981 (Green) | #B91081 (Magenta) | [#10B981, #B91081, #34D399, #D946EF, #6EE7B7, #E879F9] |
| ... | ... | ... | ... |

### B.2 Theme CSS Variables

```css
:root {
  --background: 0 0% 4%;
  --foreground: 0 0% 98%;
  --primary: 221 83% 53%;
  --secondary: 215 20% 65%;
  --accent: 142 76% 36%;
  --muted: 215 20% 65%;
  --border: 215 20% 20%;

  --chart-1: 221 83% 53%;
  --chart-2: 142 76% 36%;
  --chart-3: 0 84% 60%;
  --chart-4: 38 92% 50%;
  --chart-5: 262 83% 58%;
  --chart-6: 199 89% 48%;
}
```

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-20 | AI | Initial draft |
| 2.0 | 2025-12-20 | AI | Post Iteration 1-9 review integration |

### v2.0 Changes Summary:
- **Added**: User Personas (Section 1.5)
- **Added**: Resilience Patterns - Circuit Breaker, Retry, Graceful Degradation (Section 3.3)
- **Added**: Development Tooling - Laststance.io Stack (Section 2.6)
  - prettier-husky-lint-staged-installer
  - eslint-config-ts-prefixer
  - next-msw-integration patterns
- **Added**: Enhanced Security (Sections 10.4-10.8)
  - Password Policy, Account Lockout, Security Headers
  - Rate Limiting Matrix, Audit Logging
- **Added**: Loading States Matrix (Section 7.3)
- **Added**: Accessibility Enhancements (Section 7.4)
  - Screen Reader Announcements
  - Focus Management
- **Added**: API Response Envelope Standard (Section 5.4)
- **Added**: RTK-Query Integration Patterns (Section 5.5)
- **Added**: Upstash Redis Key Conventions (Section 6.2)
- **Added**: Enhanced Prisma Schema with Indexes
- **Added**: TypeScript Type System (Section 16)
  - Core Type Definitions
  - Zod Validation Schemas
  - ts-pattern Integration
  - Type Guards and Branded Types

---

> **Next Steps**: Continuing with Iteration 19-27 (Scalability, Internationalization, Analytics, Documentation, Deployment Pipeline, Final Review)

---

## 17. Backend Implementation Details (Iteration 10)

### 17.1 Authentication Implementation (better-auth)

#### 17.1.1 Auth Configuration

```typescript
// lib/auth/config.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/db/prisma";
import { sendEmail } from "@/lib/email/resend";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  plugins: [nextCookies()],

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 12,
    maxPasswordLength: 128,
    autoSignIn: true,

    sendResetPassword: async ({ user, url, token }, request) => {
      // Avoid awaiting to prevent timing attacks
      void sendEmail({
        to: user.email,
        subject: "Reset your password - npm-trend-clone",
        template: "password-reset",
        props: { url, userName: user.name },
      });
    },

    resetPasswordTokenExpiresIn: 3600, // 1 hour
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      void sendEmail({
        to: user.email,
        subject: "Verify your email - npm-trend-clone",
        template: "email-verification",
        props: { url, userName: user.name },
      });
    },
    expiresIn: 24 * 60 * 60, // 24 hours
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
  },

  rateLimit: {
    window: 60, // 1 minute
    max: 10, // 10 requests per window for auth endpoints
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.User;
```

#### 17.1.2 Auth Client

```typescript
// lib/auth/client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;
```

#### 17.1.3 Auth Middleware

```typescript
// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/config";

const protectedRoutes = ["/presets", "/settings"];
const authRoutes = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) =>
    path.startsWith(route)
  );

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to home if accessing auth routes with session
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: ["/presets/:path*", "/settings/:path*", "/login", "/signup"],
};
```

#### 17.1.4 Server Actions

```typescript
// app/actions/auth.ts
"use server";

import { auth } from "@/lib/auth/config";
import { revalidatePath } from "next/cache";

export async function signInWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await auth.api.signInEmail({
      body: { email, password },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: "Invalid credentials"
    };
  }
}

export async function signUpWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  try {
    await auth.api.signUpEmail({
      body: { email, password, name },
    });
    return {
      success: true,
      message: "Verification email sent"
    };
  } catch (error) {
    return {
      success: false,
      error: "Registration failed"
    };
  }
}
```

### 17.2 Database Connection Strategy

#### 17.2.1 Prisma Client Singleton

```typescript
// lib/db/prisma.ts
import { PrismaClient } from "../prisma/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
```

#### 17.2.2 Prisma Configuration

```typescript
// prisma.config.ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Use DIRECT_URL for migrations (bypasses connection pooling)
    url: env("DIRECT_URL"),
  },
});
```

#### 17.2.3 Environment Variables Structure

```bash
# .env.local
# Pooled connection (for runtime queries via PrismaClient)
DATABASE_URL="postgres://user:pass@host-pooler.region.postgres.vercel-storage.com:5432/db?sslmode=require"

# Direct connection (for migrations via Prisma CLI)
DIRECT_URL="postgres://user:pass@host.region.postgres.vercel-storage.com:5432/db?sslmode=require"
```

### 17.3 npm API Service Implementation

#### 17.3.1 Service Architecture

```typescript
// lib/api/npm/npm-api-service.ts
import { match } from "ts-pattern";
import { cache } from "@/lib/cache/kv-cache";
import { circuitBreaker } from "@/lib/resilience/circuit-breaker";
import type { DownloadDataPoint, PackageDownloads } from "@/types/npm";

const NPM_API_BASE = "https://api.npmjs.org";
const NPM_REGISTRY_BASE = "https://registry.npmjs.org";

// Rate limiting: 200ms between requests
const RATE_LIMIT_DELAY = 200;
let lastRequestTime = 0;

async function rateLimitedFetch(url: string): Promise<Response> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    await new Promise((resolve) =>
      setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest)
    );
  }

  lastRequestTime = Date.now();
  return fetch(url);
}

export class NpmApiService {
  /**
   * Fetch download statistics for a package within a date range.
   * Handles chunking for ranges > 365 days.
   */
  async getDownloads(
    packageName: string,
    startDate: string,
    endDate: string
  ): Promise<PackageDownloads> {
    const chunks = this.calculateChunks(startDate, endDate);
    const results: DownloadDataPoint[] = [];

    for (const chunk of chunks) {
      const cacheKey = `dl:${packageName}:${chunk.start}:${chunk.end}`;

      // Check cache first
      const cached = await cache.get<DownloadDataPoint[]>(cacheKey);
      if (cached) {
        results.push(...cached);
        continue;
      }

      // Fetch from npm API with circuit breaker
      const data = await circuitBreaker.execute(
        "npm-downloads",
        () => this.fetchDownloadChunk(packageName, chunk.start, chunk.end)
      );

      if (data) {
        results.push(...data.downloads);

        // Cache historical data for 7 days
        const isHistorical = this.isHistoricalData(chunk.end);
        await cache.set(
          cacheKey,
          data.downloads,
          isHistorical ? 7 * 24 * 60 * 60 : 60 * 60
        );
      }
    }

    return {
      package: packageName,
      downloads: results.sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
      total: results.reduce((sum, d) => sum + d.downloads, 0),
      start: startDate,
      end: endDate,
    };
  }

  /**
   * Search for packages by query string.
   */
  async searchPackages(query: string, limit = 10) {
    const cacheKey = `search:${query.toLowerCase()}`;

    const cached = await cache.get(cacheKey);
    if (cached) return cached;

    const encodedQuery = encodeURIComponent(query);
    const url = `${NPM_REGISTRY_BASE}/-/v1/search?text=${encodedQuery}&size=${limit}`;

    const response = await circuitBreaker.execute(
      "npm-search",
      () => rateLimitedFetch(url)
    );

    if (!response?.ok) {
      throw new Error(`Search failed: ${response?.statusText}`);
    }

    const data = await response.json();
    const results = data.objects.map((obj: any) => ({
      name: obj.package.name,
      description: obj.package.description,
      version: obj.package.version,
      weeklyDownloads: obj.package.downloads?.weekly ?? 0,
      score: obj.score,
    }));

    await cache.set(cacheKey, results, 24 * 60 * 60); // 24 hours
    return results;
  }

  /**
   * Get detailed package information.
   */
  async getPackageInfo(packageName: string) {
    const cacheKey = `pkg:${packageName}`;

    const cached = await cache.get(cacheKey);
    if (cached) return cached;

    const encodedName = encodeURIComponent(packageName);
    const url = `${NPM_REGISTRY_BASE}/${encodedName}`;

    const response = await circuitBreaker.execute(
      "npm-info",
      () => rateLimitedFetch(url)
    );

    if (!response?.ok) {
      if (response?.status === 404) {
        throw new Error(`Package not found: ${packageName}`);
      }
      throw new Error(`Failed to fetch package info: ${response?.statusText}`);
    }

    const data = await response.json();
    const latestVersion = data["dist-tags"]?.latest;
    const versionData = data.versions?.[latestVersion] ?? {};

    const info = {
      name: data.name,
      version: latestVersion,
      description: data.description,
      license: versionData.license,
      homepage: data.homepage,
      repository: data.repository,
      maintainers: data.maintainers,
      lastPublished: data.time?.[latestVersion],
    };

    await cache.set(cacheKey, info, 60 * 60); // 1 hour
    return info;
  }

  private async fetchDownloadChunk(
    packageName: string,
    start: string,
    end: string
  ) {
    const encodedName = encodeURIComponent(packageName);
    const url = `${NPM_API_BASE}/downloads/range/${start}:${end}/${encodedName}`;

    const response = await rateLimitedFetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        return { downloads: [] };
      }
      throw new Error(`Download fetch failed: ${response.statusText}`);
    }

    return response.json();
  }

  private calculateChunks(startDate: string, endDate: string) {
    const chunks: Array<{ start: string; end: string }> = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    const maxDays = 365;

    let chunkStart = start;
    while (chunkStart < end) {
      const chunkEnd = new Date(chunkStart);
      chunkEnd.setDate(chunkEnd.getDate() + maxDays - 1);

      if (chunkEnd > end) {
        chunkEnd.setTime(end.getTime());
      }

      chunks.push({
        start: this.formatDate(chunkStart),
        end: this.formatDate(chunkEnd),
      });

      chunkStart = new Date(chunkEnd);
      chunkStart.setDate(chunkStart.getDate() + 1);
    }

    return chunks;
  }

  private formatDate(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  private isHistoricalData(endDate: string): boolean {
    const end = new Date(endDate);
    const now = new Date();
    const daysDiff = (now.getTime() - end.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff > 7;
  }
}

export const npmApiService = new NpmApiService();
```

### 17.4 Cache Service Implementation

#### 17.4.1 Upstash Redis Wrapper

```typescript
// lib/cache/redis-cache.ts
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export class CacheService {
  async get<T>(key: string): Promise<T | null> {
    try {
      return await redis.get<T>(key);
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    try {
      await redis.set(key, value, { ex: ttlSeconds });
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      console.error(`Cache delete error for key ${key}:`, error);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      return (await redis.exists(key)) === 1;
    } catch (error) {
      console.error(`Cache exists error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Increment a counter (for rate limiting)
   */
  async incr(key: string, ttlSeconds: number): Promise<number> {
    try {
      const count = await redis.incr(key);
      if (count === 1) {
        await redis.expire(key, ttlSeconds);
      }
      return count;
    } catch (error) {
      console.error(`Cache incr error for key ${key}:`, error);
      return 0;
    }
  }
}

export const cache = new CacheService();
```

### 17.5 API Route Implementation Patterns

#### 17.5.1 Downloads Route

```typescript
// app/api/downloads/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { npmApiService } from "@/lib/api/npm/npm-api-service";
import { downloadRequestSchema } from "@/lib/validations/schemas";
import { rateLimit } from "@/lib/middleware/rate-limit";
import type { ApiSuccessResponse, ApiErrorResponse } from "@/types/api";

export async function GET(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = await rateLimit(request, {
    limit: 60,
    window: 60,
    identifier: "downloads",
  });

  if (!rateLimitResult.success) {
    return NextResponse.json<ApiErrorResponse>(
      {
        success: false,
        error: {
          code: "RATE_LIMITED",
          message: "Too many requests",
          details: { retryAfter: rateLimitResult.reset },
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: crypto.randomUUID(),
        },
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimitResult.reset),
          "X-RateLimit-Limit": String(rateLimitResult.limit),
          "X-RateLimit-Remaining": String(rateLimitResult.remaining),
        },
      }
    );
  }

  // Parse and validate query parameters
  const { searchParams } = new URL(request.url);
  const rawParams = {
    packages: searchParams.get("packages")?.split(",") ?? [],
    start: searchParams.get("start") ?? "",
    end: searchParams.get("end") ?? "",
    aggregation: searchParams.get("aggregation") ?? undefined,
  };

  const parseResult = downloadRequestSchema.safeParse(rawParams);

  if (!parseResult.success) {
    return NextResponse.json<ApiErrorResponse>(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request parameters",
          validationErrors: parseResult.error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
            code: e.code,
          })),
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: crypto.randomUUID(),
        },
      },
      { status: 400 }
    );
  }

  const { packages, start, end, aggregation } = parseResult.data;

  try {
    // Fetch downloads for all packages in parallel
    const downloadPromises = packages.map((pkg) =>
      npmApiService.getDownloads(pkg, start, end)
    );

    const results = await Promise.allSettled(downloadPromises);

    const data: Record<string, any> = {};
    const errors: string[] = [];

    results.forEach((result, index) => {
      const packageName = packages[index];
      if (result.status === "fulfilled") {
        data[packageName] = {
          downloads: aggregation
            ? aggregateData(result.value.downloads, aggregation)
            : result.value.downloads,
          total: result.value.total,
        };
      } else {
        errors.push(packageName);
      }
    });

    return NextResponse.json<ApiSuccessResponse<typeof data>>({
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
        cached: false,
        errors: errors.length > 0 ? errors : undefined,
      },
    });
  } catch (error) {
    console.error("Downloads API error:", error);
    return NextResponse.json<ApiErrorResponse>(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to fetch download data",
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: crypto.randomUUID(),
        },
      },
      { status: 500 }
    );
  }
}

function aggregateData(
  data: Array<{ date: string; downloads: number }>,
  aggregation: "weekly" | "monthly"
) {
  // Aggregation logic implementation
  const grouped = new Map<string, number>();

  for (const point of data) {
    const date = new Date(point.date);
    const key = aggregation === "weekly"
      ? getWeekKey(date)
      : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    grouped.set(key, (grouped.get(key) ?? 0) + point.downloads);
  }

  return Array.from(grouped.entries()).map(([date, downloads]) => ({
    date,
    downloads,
  }));
}

function getWeekKey(date: Date): string {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());
  return startOfWeek.toISOString().split("T")[0];
}
```

#### 17.5.2 Rate Limiting Middleware

```typescript
// lib/middleware/rate-limit.ts
import { NextRequest } from "next/server";
import { cache } from "@/lib/cache/kv-cache";

interface RateLimitConfig {
  limit: number;
  window: number; // seconds
  identifier: string;
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export async function rateLimit(
  request: NextRequest,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]
    ?? request.headers.get("x-real-ip")
    ?? "unknown";

  const key = `rl:${ip}:${config.identifier}`;

  const count = await cache.incr(key, config.window);
  const remaining = Math.max(0, config.limit - count);

  return {
    success: count <= config.limit,
    limit: config.limit,
    remaining,
    reset: config.window,
  };
}
```

### 17.6 Circuit Breaker Implementation

```typescript
// lib/resilience/circuit-breaker.ts
import { match } from "ts-pattern";

type CircuitState = "closed" | "open" | "half-open";

interface CircuitBreakerConfig {
  failureThreshold: number;
  successThreshold: number;
  timeout: number;
  monitoringWindow: number;
}

interface CircuitInfo {
  state: CircuitState;
  failures: number;
  successes: number;
  lastFailure: number;
  lastStateChange: number;
}

class CircuitBreaker {
  private circuits = new Map<string, CircuitInfo>();
  private config: CircuitBreakerConfig = {
    failureThreshold: 5,
    successThreshold: 2,
    timeout: 30000,
    monitoringWindow: 60000,
  };

  async execute<T>(
    name: string,
    operation: () => Promise<T>
  ): Promise<T | null> {
    const circuit = this.getOrCreateCircuit(name);

    return match(circuit.state)
      .with("open", () => this.handleOpenState(name, circuit, operation))
      .with("half-open", () => this.handleHalfOpenState(name, circuit, operation))
      .with("closed", () => this.handleClosedState(name, circuit, operation))
      .exhaustive();
  }

  private async handleOpenState<T>(
    name: string,
    circuit: CircuitInfo,
    operation: () => Promise<T>
  ): Promise<T | null> {
    const now = Date.now();
    if (now - circuit.lastStateChange >= this.config.timeout) {
      // Transition to half-open
      this.updateCircuit(name, { state: "half-open", successes: 0 });
      return this.handleHalfOpenState(name, this.circuits.get(name)!, operation);
    }
    console.warn(`Circuit ${name} is open. Returning null.`);
    return null;
  }

  private async handleHalfOpenState<T>(
    name: string,
    circuit: CircuitInfo,
    operation: () => Promise<T>
  ): Promise<T | null> {
    try {
      const result = await operation();
      const newSuccesses = circuit.successes + 1;

      if (newSuccesses >= this.config.successThreshold) {
        this.updateCircuit(name, {
          state: "closed",
          failures: 0,
          successes: 0
        });
      } else {
        this.updateCircuit(name, { successes: newSuccesses });
      }

      return result;
    } catch (error) {
      this.updateCircuit(name, { state: "open", failures: circuit.failures + 1 });
      throw error;
    }
  }

  private async handleClosedState<T>(
    name: string,
    circuit: CircuitInfo,
    operation: () => Promise<T>
  ): Promise<T> {
    try {
      const result = await operation();
      // Reset failures on success
      if (circuit.failures > 0) {
        this.updateCircuit(name, { failures: 0 });
      }
      return result;
    } catch (error) {
      const now = Date.now();
      const isWithinWindow =
        now - circuit.lastFailure < this.config.monitoringWindow;

      const newFailures = isWithinWindow ? circuit.failures + 1 : 1;

      if (newFailures >= this.config.failureThreshold) {
        this.updateCircuit(name, {
          state: "open",
          failures: newFailures,
          lastFailure: now
        });
      } else {
        this.updateCircuit(name, {
          failures: newFailures,
          lastFailure: now
        });
      }

      throw error;
    }
  }

  private getOrCreateCircuit(name: string): CircuitInfo {
    if (!this.circuits.has(name)) {
      this.circuits.set(name, {
        state: "closed",
        failures: 0,
        successes: 0,
        lastFailure: 0,
        lastStateChange: Date.now(),
      });
    }
    return this.circuits.get(name)!;
  }

  private updateCircuit(name: string, updates: Partial<CircuitInfo>): void {
    const circuit = this.circuits.get(name)!;
    const hasStateChange = updates.state && updates.state !== circuit.state;

    this.circuits.set(name, {
      ...circuit,
      ...updates,
      lastStateChange: hasStateChange ? Date.now() : circuit.lastStateChange,
    });
  }

  getState(name: string): CircuitState {
    return this.circuits.get(name)?.state ?? "closed";
  }
}

export const circuitBreaker = new CircuitBreaker();
```

---

## 18. Frontend Implementation Details (Iteration 11)

### 18.1 Component Architecture

#### 18.1.1 Component Hierarchy

```
app/
├── layout.tsx                 # Root layout with providers
├── page.tsx                   # Home page (main comparison view)
└── [packages]/
    └── page.tsx               # Dynamic comparison route

components/
├── charts/
│   ├── DownloadChart.tsx      # Main chart component
│   ├── ChartTooltip.tsx       # Custom tooltip
│   ├── ChartLegend.tsx        # Interactive legend
│   └── ChartSkeleton.tsx      # Loading state
├── package/
│   ├── PackageSearch.tsx      # Combobox with autocomplete
│   ├── PackageTags.tsx        # Selected packages display
│   ├── PackageInfoCard.tsx    # Package details card
│   └── PackageInfoSkeleton.tsx
├── theme/
│   ├── ThemeProvider.tsx      # Theme context provider
│   ├── ThemeSelector.tsx      # Theme picker UI
│   └── RandomThemeToggle.tsx  # Random theme mode
├── layout/
│   ├── Header.tsx             # Navigation header
│   ├── Footer.tsx             # Footer with links
│   └── MobileNav.tsx          # Mobile navigation
└── ui/
    └── (shadcn components)
```

### 18.2 Download Chart Component

#### 18.2.1 Main Chart Implementation

```typescript
// components/charts/DownloadChart.tsx
"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { ChartTooltipContent } from "./ChartTooltip";
import { useTheme } from "@/hooks/useTheme";
import type { PackageDownloads } from "@/types/npm";

interface DownloadChartProps {
  data: PackageDownloads[];
  isLoading?: boolean;
}

export function DownloadChart({ data, isLoading }: DownloadChartProps) {
  const { theme } = useTheme();

  // Transform data for Recharts
  const chartData = useMemo(() => {
    if (!data.length) return [];

    const dateMap = new Map<string, Record<string, number>>();

    for (const pkg of data) {
      for (const point of pkg.downloads) {
        const existing = dateMap.get(point.date) ?? { date: point.date };
        existing[pkg.package] = point.downloads;
        dateMap.set(point.date, existing);
      }
    }

    return Array.from(dateMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [data]);

  // Generate chart config for shadcn/ui
  const chartConfig = useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {};
    data.forEach((pkg, index) => {
      config[pkg.package] = {
        label: pkg.package,
        color: theme.colors.chart[index % theme.colors.chart.length],
      };
    });
    return config;
  }, [data, theme]);

  if (isLoading) {
    return <ChartSkeleton />;
  }

  if (!data.length) {
    return (
      <div className="flex h-[400px] items-center justify-center text-muted-foreground">
        Add packages to compare
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          accessibilityLayer
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tickFormatter={(value) => formatDateTick(value)}
            stroke="var(--muted-foreground)"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tickFormatter={(value) => formatDownloads(value)}
            stroke="var(--muted-foreground)"
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />

          {data.map((pkg, index) => (
            <Line
              key={pkg.package}
              type="monotone"
              dataKey={pkg.package}
              stroke={theme.colors.chart[index % theme.colors.chart.length]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

function formatDateTick(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

function formatDownloads(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return String(value);
}
```

#### 18.2.2 Custom Tooltip

```typescript
// components/charts/ChartTooltip.tsx
"use client";

import { format } from "date-fns";
import type { TooltipProps } from "recharts";

export function ChartTooltipContent({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border bg-background p-3 shadow-lg">
      <p className="mb-2 font-medium">
        {format(new Date(label), "MMMM d, yyyy")}
      </p>
      <div className="space-y-1">
        {payload.map((entry) => (
          <div
            key={entry.name}
            className="flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-muted-foreground">
                {entry.name}
              </span>
            </div>
            <span className="font-mono text-sm font-medium">
              {entry.value?.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 18.3 Package Search Component

#### 18.3.1 Autocomplete Combobox

```typescript
// components/package/PackageSearch.tsx
"use client";

import * as React from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchPackagesQuery } from "@/lib/store/api/packagesApi";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronsUpDownIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface PackageSearchProps {
  selectedPackages: string[];
  onSelect: (packageName: string) => void;
  maxPackages?: number;
}

export function PackageSearch({
  selectedPackages,
  onSelect,
  maxPackages = 6,
}: PackageSearchProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading, isFetching } = useSearchPackagesQuery(
    debouncedQuery,
    {
      skip: debouncedQuery.length < 2,
    }
  );

  const canAddMore = selectedPackages.length < maxPackages;

  const handleSelect = (packageName: string) => {
    if (selectedPackages.includes(packageName)) {
      return; // Already selected
    }
    if (!canAddMore) {
      return; // Max packages reached
    }
    onSelect(packageName);
    setQuery("");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Search npm packages"
          className="w-full justify-between"
          disabled={!canAddMore}
        >
          <span className="text-muted-foreground">
            {canAddMore
              ? "Search npm packages..."
              : `Maximum ${maxPackages} packages`}
          </span>
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search npm packages..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {isLoading || isFetching ? (
              <div className="flex items-center justify-center py-6">
                <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : !data?.length && query.length >= 2 ? (
              <CommandEmpty>No packages found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {data?.map((pkg) => {
                  const isSelected = selectedPackages.includes(pkg.name);
                  return (
                    <CommandItem
                      key={pkg.name}
                      value={pkg.name}
                      onSelect={() => handleSelect(pkg.name)}
                      disabled={isSelected}
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{pkg.name}</span>
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {pkg.description}
                        </span>
                      </div>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {formatWeeklyDownloads(pkg.weeklyDownloads)}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function formatWeeklyDownloads(downloads: number): string {
  if (downloads >= 1_000_000) return `${(downloads / 1_000_000).toFixed(1)}M/w`;
  if (downloads >= 1_000) return `${(downloads / 1_000).toFixed(0)}K/w`;
  return `${downloads}/w`;
}
```

### 18.4 Package Tags Component

```typescript
// components/package/PackageTags.tsx
"use client";

import { XIcon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PackageTagsProps {
  packages: string[];
  onRemove: (packageName: string) => void;
}

export function PackageTags({ packages, onRemove }: PackageTagsProps) {
  const { theme } = useTheme();

  if (!packages.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2" role="list" aria-label="Selected packages">
      {packages.map((pkg, index) => (
        <Badge
          key={pkg}
          variant="secondary"
          className="group flex items-center gap-1 px-3 py-1.5 text-sm"
          style={{
            borderColor: theme.colors.chart[index % theme.colors.chart.length],
            borderWidth: 2,
          }}
          role="listitem"
        >
          <span
            className="h-2 w-2 rounded-full"
            style={{
              backgroundColor: theme.colors.chart[index % theme.colors.chart.length],
            }}
          />
          <span className="max-w-[150px] truncate">{pkg}</span>
          <Button
            variant="ghost"
            size="icon"
            className="ml-1 h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={() => onRemove(pkg)}
            aria-label={`Remove ${pkg}`}
          >
            <XIcon className="h-3 w-3" />
          </Button>
        </Badge>
      ))}
    </div>
  );
}
```

### 18.5 RTK-Query Store Setup

#### 18.5.1 Store Configuration

```typescript
// lib/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "./api/baseApi";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

#### 18.5.2 Base API Configuration

```typescript
// lib/store/api/baseApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  tagTypes: ["Downloads", "Packages", "Presets"],
  endpoints: () => ({}),
});
```

#### 18.5.3 Downloads API

```typescript
// lib/store/api/downloadsApi.ts
import { baseApi } from "./baseApi";
import type { DownloadRequest, DownloadResponse } from "@/types/api";

export const downloadsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDownloads: builder.query<DownloadResponse, DownloadRequest>({
      query: ({ packages, start, end, aggregation }) => ({
        url: "/downloads",
        params: {
          packages: packages.join(","),
          start,
          end,
          aggregation,
        },
      }),
      providesTags: (result, error, { packages }) =>
        packages.map((pkg) => ({ type: "Downloads" as const, id: pkg })),
      // Stale time: 5 minutes
      keepUnusedDataFor: 300,
    }),
  }),
});

export const { useGetDownloadsQuery } = downloadsApi;
```

#### 18.5.4 Packages API

```typescript
// lib/store/api/packagesApi.ts
import { baseApi } from "./baseApi";
import type { SearchResponse, PackageInfoResponse } from "@/types/api";

export const packagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchPackages: builder.query<SearchResponse["results"], string>({
      query: (query) => ({
        url: "/packages/search",
        params: { q: query, limit: 10 },
      }),
      transformResponse: (response: SearchResponse) => response.results,
      providesTags: ["Packages"],
      keepUnusedDataFor: 60,
    }),

    getPackageInfo: builder.query<PackageInfoResponse, string>({
      query: (name) => `/packages/${encodeURIComponent(name)}`,
      providesTags: (result, error, name) => [
        { type: "Packages", id: name },
      ],
      keepUnusedDataFor: 300,
    }),
  }),
});

export const {
  useSearchPackagesQuery,
  useGetPackageInfoQuery,
} = packagesApi;
```

### 18.6 URL State Management (nuqs)

```typescript
// hooks/usePackageParams.ts
import { useQueryStates, parseAsArrayOf, parseAsString } from "nuqs";

export function usePackageParams() {
  const [params, setParams] = useQueryStates({
    packages: parseAsArrayOf(parseAsString).withDefault([]),
    range: parseAsString.withDefault("2Y"),
    theme: parseAsString.withDefault("default"),
  });

  const addPackage = (name: string) => {
    if (params.packages.includes(name)) return;
    if (params.packages.length >= 6) return;

    setParams((prev) => ({
      ...prev,
      packages: [...prev.packages, name],
    }));
  };

  const removePackage = (name: string) => {
    setParams((prev) => ({
      ...prev,
      packages: prev.packages.filter((p) => p !== name),
    }));
  };

  const setTimeRange = (range: string) => {
    setParams((prev) => ({ ...prev, range }));
  };

  return {
    packages: params.packages,
    timeRange: params.range,
    theme: params.theme,
    addPackage,
    removePackage,
    setTimeRange,
    setParams,
  };
}
```

### 18.7 Loading States & Skeletons

```typescript
// components/charts/ChartSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function ChartSkeleton() {
  return (
    <div className="h-[400px] w-full rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-4 w-24" />
        <div className="flex gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      <div className="relative h-[320px]">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-3 w-8" />
          ))}
        </div>
        {/* Grid lines */}
        <div className="ml-12 h-full flex flex-col justify-between">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-t border-dashed border-muted" />
          ))}
        </div>
        {/* X-axis labels */}
        <div className="absolute bottom-0 left-12 right-0 flex justify-between">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-3 w-12" />
          ))}
        </div>
      </div>
    </div>
  );
}

// components/package/PackageInfoSkeleton.tsx
export function PackageInfoSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between mb-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <div className="flex gap-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}
```

### 18.8 Accessibility Implementation

#### 18.8.1 Live Region Announcements

```typescript
// components/a11y/LiveRegion.tsx
"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface LiveRegionContextType {
  announce: (message: string, politeness?: "polite" | "assertive") => void;
}

const LiveRegionContext = createContext<LiveRegionContextType | null>(null);

export function LiveRegionProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState("");
  const [politeness, setPoliteness] = useState<"polite" | "assertive">("polite");

  const announce = useCallback((msg: string, level: "polite" | "assertive" = "polite") => {
    setMessage("");
    setPoliteness(level);
    // Force re-announcement by clearing first
    setTimeout(() => setMessage(msg), 100);
  }, []);

  return (
    <LiveRegionContext.Provider value={{ announce }}>
      {children}
      <div
        role="status"
        aria-live={politeness}
        aria-atomic="true"
        className="sr-only"
      >
        {message}
      </div>
    </LiveRegionContext.Provider>
  );
}

export function useLiveRegion() {
  const context = useContext(LiveRegionContext);
  if (!context) {
    throw new Error("useLiveRegion must be used within LiveRegionProvider");
  }
  return context;
}
```

#### 18.8.2 Skip Links

```typescript
// components/a11y/SkipLinks.tsx
export function SkipLinks() {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-50 rounded bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only"
      >
        Skip to main content
      </a>
      <a
        href="#package-search"
        className="fixed left-4 top-16 z-50 rounded bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only"
      >
        Skip to package search
      </a>
    </div>
  );
}
```

---

## 19. Testing Strategy (Iteration 12)

### 19.1 Test Architecture Overview

```
tests/
├── unit/                    # Unit tests (Vitest)
│   ├── components/          # Component logic tests
│   ├── hooks/               # Custom hooks tests
│   ├── utils/               # Utility function tests
│   └── services/            # Service layer tests
├── integration/             # Integration tests (Vitest + MSW)
│   ├── api/                 # API route tests
│   └── stores/              # Store integration tests
├── e2e/                     # E2E tests (Playwright)
│   ├── flows/               # User flow tests
│   └── visual/              # Visual regression tests
└── storybook/               # Storybook interaction tests
    ├── a11y/                # Accessibility tests
    └── interactions/        # Component interaction tests
```

### 19.2 Unit Testing with Vitest

#### 19.2.1 Component Testing

```typescript
// tests/unit/components/PackageSearch.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PackageSearch } from "@/components/search/PackageSearch";

// Mock the nuqs hook
vi.mock("nuqs", () => ({
  useQueryState: vi.fn(() => ["", vi.fn()]),
}));

describe("PackageSearch", () => {
  it("renders search input with correct placeholder", () => {
    render(<PackageSearch />);
    expect(screen.getByPlaceholderText(/search packages/i)).toBeInTheDocument();
  });

  it("shows suggestions when typing", async () => {
    const user = userEvent.setup();
    render(<PackageSearch />);

    const input = screen.getByRole("combobox");
    await user.type(input, "react");

    await waitFor(() => {
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });
  });

  it("selects package on click", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<PackageSearch onPackageSelect={onSelect} />);

    const input = screen.getByRole("combobox");
    await user.type(input, "react");

    await waitFor(() => {
      const option = screen.getByRole("option", { name: /react/i });
      return user.click(option);
    });

    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({
      name: expect.stringContaining("react"),
    }));
  });

  it("handles keyboard navigation", async () => {
    const user = userEvent.setup();
    render(<PackageSearch />);

    const input = screen.getByRole("combobox");
    await user.type(input, "react");
    await user.keyboard("{ArrowDown}{ArrowDown}{Enter}");

    await waitFor(() => {
      expect(input).toHaveValue(expect.stringContaining("react"));
    });
  });

  it("clears input on escape", async () => {
    const user = userEvent.setup();
    render(<PackageSearch />);

    const input = screen.getByRole("combobox");
    await user.type(input, "react");
    await user.keyboard("{Escape}");

    expect(input).toHaveValue("");
  });
});
```

#### 19.2.2 Hook Testing

```typescript
// tests/unit/hooks/usePackageComparison.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePackageComparison } from "@/hooks/usePackageComparison";
import { MAX_PACKAGES } from "@/lib/constants";

describe("usePackageComparison", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("starts with empty packages array", () => {
    const { result } = renderHook(() => usePackageComparison());
    expect(result.current.packages).toEqual([]);
  });

  it("adds package successfully", () => {
    const { result } = renderHook(() => usePackageComparison());

    act(() => {
      result.current.addPackage("react");
    });

    expect(result.current.packages).toContain("react");
  });

  it("prevents duplicate packages", () => {
    const { result } = renderHook(() => usePackageComparison());

    act(() => {
      result.current.addPackage("react");
      result.current.addPackage("react");
    });

    expect(result.current.packages).toHaveLength(1);
  });

  it("enforces maximum package limit", () => {
    const { result } = renderHook(() => usePackageComparison());

    act(() => {
      for (let i = 0; i < MAX_PACKAGES + 2; i++) {
        result.current.addPackage(`package-${i}`);
      }
    });

    expect(result.current.packages).toHaveLength(MAX_PACKAGES);
  });

  it("removes package successfully", () => {
    const { result } = renderHook(() => usePackageComparison());

    act(() => {
      result.current.addPackage("react");
      result.current.addPackage("vue");
      result.current.removePackage("react");
    });

    expect(result.current.packages).toEqual(["vue"]);
  });

  it("clears all packages", () => {
    const { result } = renderHook(() => usePackageComparison());

    act(() => {
      result.current.addPackage("react");
      result.current.addPackage("vue");
      result.current.clearAll();
    });

    expect(result.current.packages).toEqual([]);
  });
});
```

#### 19.2.3 Utility Function Testing

```typescript
// tests/unit/utils/formatters.test.ts
import { describe, it, expect } from "vitest";
import {
  formatDownloadCount,
  formatDate,
  formatPercentageChange,
  parsePackageQuery,
} from "@/lib/utils/formatters";

describe("formatDownloadCount", () => {
  it("formats numbers under 1000", () => {
    expect(formatDownloadCount(999)).toBe("999");
  });

  it("formats thousands", () => {
    expect(formatDownloadCount(1500)).toBe("1.5K");
    expect(formatDownloadCount(12345)).toBe("12.3K");
  });

  it("formats millions", () => {
    expect(formatDownloadCount(1500000)).toBe("1.5M");
    expect(formatDownloadCount(123456789)).toBe("123.5M");
  });

  it("formats billions", () => {
    expect(formatDownloadCount(1500000000)).toBe("1.5B");
  });

  it("handles zero", () => {
    expect(formatDownloadCount(0)).toBe("0");
  });

  it("handles negative numbers", () => {
    expect(formatDownloadCount(-1000)).toBe("-1K");
  });
});

describe("formatPercentageChange", () => {
  it("formats positive changes with plus sign", () => {
    expect(formatPercentageChange(15.5)).toBe("+15.5%");
  });

  it("formats negative changes", () => {
    expect(formatPercentageChange(-10.2)).toBe("-10.2%");
  });

  it("handles zero", () => {
    expect(formatPercentageChange(0)).toBe("0%");
  });

  it("rounds to specified decimals", () => {
    expect(formatPercentageChange(15.567, 1)).toBe("+15.6%");
    expect(formatPercentageChange(15.567, 0)).toBe("+16%");
  });
});

describe("parsePackageQuery", () => {
  it("parses single package", () => {
    expect(parsePackageQuery("react")).toEqual(["react"]);
  });

  it("parses comma-separated packages", () => {
    expect(parsePackageQuery("react,vue,angular")).toEqual([
      "react",
      "vue",
      "angular",
    ]);
  });

  it("trims whitespace", () => {
    expect(parsePackageQuery(" react , vue ")).toEqual(["react", "vue"]);
  });

  it("handles scoped packages", () => {
    expect(parsePackageQuery("@types/react,@vue/core")).toEqual([
      "@types/react",
      "@vue/core",
    ]);
  });

  it("removes duplicates", () => {
    expect(parsePackageQuery("react,react,vue")).toEqual(["react", "vue"]);
  });
});
```

### 19.3 Integration Testing with MSW

#### 19.3.1 MSW Handlers Setup

```typescript
// tests/mocks/handlers.ts
import { http, HttpResponse, delay } from "msw";
import { mockPackageData, mockDownloadData } from "./fixtures";

export const handlers = [
  // Package search endpoint
  http.get("/api/packages/search", async ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get("q");

    await delay(100); // Simulate network latency

    if (!query) {
      return HttpResponse.json({ packages: [] });
    }

    const filtered = mockPackageData.filter((pkg) =>
      pkg.name.toLowerCase().includes(query.toLowerCase())
    );

    return HttpResponse.json({ packages: filtered.slice(0, 10) });
  }),

  // Download statistics endpoint
  http.get("/api/downloads/:package", async ({ params }) => {
    const packageName = params.package as string;

    await delay(100);

    const data = mockDownloadData[packageName];
    if (!data) {
      return HttpResponse.json(
        { error: "Package not found" },
        { status: 404 }
      );
    }

    return HttpResponse.json(data);
  }),

  // Bulk downloads endpoint
  http.post("/api/downloads/bulk", async ({ request }) => {
    const body = await request.json() as { packages: string[] };

    await delay(150);

    const results = body.packages.reduce((acc, pkg) => {
      acc[pkg] = mockDownloadData[pkg] || null;
      return acc;
    }, {} as Record<string, unknown>);

    return HttpResponse.json(results);
  }),

  // Rate limited endpoint simulation
  http.get("/api/rate-limited", async () => {
    return HttpResponse.json(
      { error: "Too Many Requests" },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }),
];

// Error handlers for testing error states
export const errorHandlers = [
  http.get("/api/packages/search", () => {
    return HttpResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }),

  http.get("/api/downloads/:package", () => {
    return HttpResponse.json(
      { error: "Service Unavailable" },
      { status: 503 }
    );
  }),
];
```

#### 19.3.2 Integration Test Examples

```typescript
// tests/integration/api/downloads.test.ts
import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { setupServer } from "msw/node";
import { handlers, errorHandlers } from "../../mocks/handlers";

const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Downloads API Integration", () => {
  it("fetches package downloads successfully", async () => {
    const response = await fetch("/api/downloads/react");
    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data).toHaveProperty("downloads");
    expect(Array.isArray(data.downloads)).toBe(true);
  });

  it("handles package not found", async () => {
    const response = await fetch("/api/downloads/nonexistent-package");

    expect(response.status).toBe(404);
  });

  it("handles server errors gracefully", async () => {
    server.use(...errorHandlers);

    const response = await fetch("/api/downloads/react");

    expect(response.status).toBe(503);
  });

  it("fetches bulk downloads", async () => {
    const response = await fetch("/api/downloads/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ packages: ["react", "vue"] }),
    });
    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data).toHaveProperty("react");
    expect(data).toHaveProperty("vue");
  });
});
```

### 19.4 E2E Testing with Playwright

#### 19.4.1 Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html", { open: "never" }],
    ["json", { outputFile: "test-results/results.json" }],
  ],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 12"] },
    },
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

#### 19.4.2 E2E Test Examples

```typescript
// tests/e2e/flows/package-comparison.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Package Comparison Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("user can search and add packages", async ({ page }) => {
    // Search for react
    await page.getByPlaceholder(/search packages/i).fill("react");
    await page.getByRole("option", { name: "react" }).click();

    // Verify package tag appears
    await expect(page.getByTestId("package-tag-react")).toBeVisible();

    // Search for vue
    await page.getByPlaceholder(/search packages/i).fill("vue");
    await page.getByRole("option", { name: "vue" }).click();

    // Verify both packages are displayed
    await expect(page.getByTestId("package-tag-react")).toBeVisible();
    await expect(page.getByTestId("package-tag-vue")).toBeVisible();
  });

  test("user can remove packages", async ({ page }) => {
    // Add packages first
    await page.getByPlaceholder(/search packages/i).fill("react");
    await page.getByRole("option", { name: "react" }).click();

    // Remove package
    await page.getByTestId("remove-package-react").click();

    // Verify package is removed
    await expect(page.getByTestId("package-tag-react")).not.toBeVisible();
  });

  test("chart updates with package data", async ({ page }) => {
    // Add a package
    await page.getByPlaceholder(/search packages/i).fill("react");
    await page.getByRole("option", { name: "react" }).click();

    // Wait for chart to load
    await expect(page.getByTestId("download-chart")).toBeVisible();

    // Verify chart has data
    const chartPaths = page.locator("[data-testid='download-chart'] path");
    await expect(chartPaths.first()).toBeVisible();
  });

  test("URL updates with selected packages", async ({ page }) => {
    // Add packages
    await page.getByPlaceholder(/search packages/i).fill("react");
    await page.getByRole("option", { name: "react" }).click();

    // Check URL contains package
    await expect(page).toHaveURL(/packages=react/);

    // Add another package
    await page.getByPlaceholder(/search packages/i).fill("vue");
    await page.getByRole("option", { name: "vue" }).click();

    // Check URL contains both packages
    await expect(page).toHaveURL(/packages=react.*vue|packages=vue.*react/);
  });

  test("navigating to URL with packages loads them", async ({ page }) => {
    // Navigate directly to URL with packages
    await page.goto("/?packages=react,vue");

    // Verify packages are loaded
    await expect(page.getByTestId("package-tag-react")).toBeVisible();
    await expect(page.getByTestId("package-tag-vue")).toBeVisible();
  });
});
```

#### 19.4.3 Accessibility E2E Tests

```typescript
// tests/e2e/a11y/accessibility.spec.ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility", () => {
  test("homepage has no accessibility violations", async ({ page }) => {
    await page.goto("/");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("comparison page has no accessibility violations", async ({ page }) => {
    await page.goto("/?packages=react,vue");

    // Wait for content to load
    await page.waitForSelector("[data-testid='download-chart']");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .exclude(".recharts-surface") // Exclude chart SVG (complex to make accessible)
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("keyboard navigation works correctly", async ({ page }) => {
    await page.goto("/");

    // Tab to search input
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab"); // Skip to search

    // Verify search is focused
    const searchInput = page.getByPlaceholder(/search packages/i);
    await expect(searchInput).toBeFocused();

    // Type and navigate with keyboard
    await searchInput.fill("react");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    // Verify package was added
    await expect(page.getByTestId("package-tag-react")).toBeVisible();
  });

  test("skip links work correctly", async ({ page }) => {
    await page.goto("/");

    // Focus skip link
    await page.keyboard.press("Tab");

    // Click skip link
    await page.keyboard.press("Enter");

    // Verify main content is focused
    const mainContent = page.locator("#main-content");
    await expect(mainContent).toBeFocused();
  });

  test("color contrast meets WCAG AA", async ({ page }) => {
    await page.goto("/");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2aa"])
      .options({
        rules: {
          "color-contrast": { enabled: true },
        },
      })
      .analyze();

    const contrastViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === "color-contrast"
    );

    expect(contrastViolations).toEqual([]);
  });
});
```

### 19.5 Storybook Interaction Tests

```typescript
// components/search/PackageSearch.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent, expect } from "@storybook/test";
import { PackageSearch } from "./PackageSearch";

const meta: Meta<typeof PackageSearch> = {
  title: "Search/PackageSearch",
  component: PackageSearch,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find and interact with search input
    const input = canvas.getByPlaceholderText(/search packages/i);
    await userEvent.type(input, "react", { delay: 50 });

    // Wait for suggestions to appear
    const listbox = await canvas.findByRole("listbox");
    await expect(listbox).toBeInTheDocument();

    // Click on first option
    const option = await canvas.findByRole("option", { name: /react/i });
    await userEvent.click(option);

    // Verify input is updated
    await expect(input).toHaveValue("react");
  },
};

export const KeyboardNavigation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByPlaceholderText(/search packages/i);
    await userEvent.type(input, "vue");

    // Navigate with keyboard
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{Enter}");

    await expect(input).toHaveValue(expect.stringContaining("vue"));
  },
};

export const ClearOnEscape: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByPlaceholderText(/search packages/i);
    await userEvent.type(input, "angular");
    await userEvent.keyboard("{Escape}");

    await expect(input).toHaveValue("");
  },
};
```

### 19.6 Test Coverage Configuration

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/unit/**/*.test.{ts,tsx}", "tests/integration/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "node_modules/",
        "tests/",
        "**/*.d.ts",
        "**/*.stories.tsx",
        "**/types/**",
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
    reporters: ["verbose", "json"],
    outputFile: {
      json: "./test-results/vitest-results.json",
    },
  },
});
```

---

## 20. Data Layer Implementation (Iteration 13)

### 20.1 Database Schema (Prisma)

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// User management
model User {
  id            String          @id @default(cuid())
  email         String          @unique
  emailVerified DateTime?
  name          String?
  image         String?
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  accounts      Account[]
  sessions      Session[]
  favorites     FavoritePackage[]
  comparisons   SavedComparison[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

// Package tracking
model FavoritePackage {
  id        String   @id @default(cuid())
  userId    String
  package   String
  addedAt   DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, package])
  @@index([userId])
  @@index([package])
}

model SavedComparison {
  id        String   @id @default(cuid())
  userId    String
  name      String
  packages  String[] // Array of package names
  period    String   @default("1y")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

// Cache table for npm data
model PackageCache {
  id           String   @id @default(cuid())
  packageName  String   @unique
  metadata     Json     // Package metadata from npm
  lastFetched  DateTime @default(now())

  @@index([packageName])
  @@index([lastFetched])
}

model DownloadCache {
  id           String   @id @default(cuid())
  packageName  String
  period       String   // "daily", "weekly", "monthly"
  startDate    DateTime
  endDate      DateTime
  data         Json     // Download statistics
  lastFetched  DateTime @default(now())

  @@unique([packageName, period, startDate, endDate])
  @@index([packageName])
  @@index([lastFetched])
}

// Analytics (optional)
model PageView {
  id        String   @id @default(cuid())
  path      String
  packages  String[] // Packages being compared
  userAgent String?
  referrer  String?
  createdAt DateTime @default(now())

  @@index([path])
  @@index([createdAt])
}
```

### 20.2 Data Access Layer

```typescript
// lib/db/packages.ts
import { prisma } from "@/lib/prisma";
import { PackageCache, DownloadCache, Prisma } from "@prisma/client";

const CACHE_TTL = {
  metadata: 24 * 60 * 60 * 1000, // 24 hours
  downloads: 60 * 60 * 1000, // 1 hour
} as const;

/**
 * Get package metadata from cache or fetch from npm
 */
export async function getPackageMetadata(
  packageName: string
): Promise<PackageCache | null> {
  const cached = await prisma.packageCache.findUnique({
    where: { packageName },
  });

  if (cached && Date.now() - cached.lastFetched.getTime() < CACHE_TTL.metadata) {
    return cached;
  }

  return null;
}

/**
 * Update package metadata cache
 */
export async function updatePackageMetadata(
  packageName: string,
  metadata: Prisma.InputJsonValue
): Promise<PackageCache> {
  return prisma.packageCache.upsert({
    where: { packageName },
    update: {
      metadata,
      lastFetched: new Date(),
    },
    create: {
      packageName,
      metadata,
      lastFetched: new Date(),
    },
  });
}

/**
 * Get download statistics from cache
 */
export async function getDownloadCache(
  packageName: string,
  period: string,
  startDate: Date,
  endDate: Date
): Promise<DownloadCache | null> {
  const cached = await prisma.downloadCache.findUnique({
    where: {
      packageName_period_startDate_endDate: {
        packageName,
        period,
        startDate,
        endDate,
      },
    },
  });

  if (cached && Date.now() - cached.lastFetched.getTime() < CACHE_TTL.downloads) {
    return cached;
  }

  return null;
}

/**
 * Update download statistics cache
 */
export async function updateDownloadCache(
  packageName: string,
  period: string,
  startDate: Date,
  endDate: Date,
  data: Prisma.InputJsonValue
): Promise<DownloadCache> {
  return prisma.downloadCache.upsert({
    where: {
      packageName_period_startDate_endDate: {
        packageName,
        period,
        startDate,
        endDate,
      },
    },
    update: {
      data,
      lastFetched: new Date(),
    },
    create: {
      packageName,
      period,
      startDate,
      endDate,
      data,
      lastFetched: new Date(),
    },
  });
}

/**
 * Clean up stale cache entries
 */
export async function cleanupStaleCache(): Promise<{
  metadata: number;
  downloads: number;
}> {
  const metadataThreshold = new Date(Date.now() - CACHE_TTL.metadata * 7);
  const downloadThreshold = new Date(Date.now() - CACHE_TTL.downloads * 24);

  const [metadataResult, downloadResult] = await Promise.all([
    prisma.packageCache.deleteMany({
      where: { lastFetched: { lt: metadataThreshold } },
    }),
    prisma.downloadCache.deleteMany({
      where: { lastFetched: { lt: downloadThreshold } },
    }),
  ]);

  return {
    metadata: metadataResult.count,
    downloads: downloadResult.count,
  };
}
```

### 20.3 User Data Operations

```typescript
// lib/db/users.ts
import { prisma } from "@/lib/prisma";
import { FavoritePackage, SavedComparison } from "@prisma/client";

/**
 * Get user's favorite packages
 */
export async function getUserFavorites(userId: string): Promise<FavoritePackage[]> {
  return prisma.favoritePackage.findMany({
    where: { userId },
    orderBy: { addedAt: "desc" },
  });
}

/**
 * Add package to user's favorites
 */
export async function addFavorite(
  userId: string,
  packageName: string
): Promise<FavoritePackage> {
  return prisma.favoritePackage.create({
    data: {
      userId,
      package: packageName,
    },
  });
}

/**
 * Remove package from user's favorites
 */
export async function removeFavorite(
  userId: string,
  packageName: string
): Promise<void> {
  await prisma.favoritePackage.delete({
    where: {
      userId_package: { userId, package: packageName },
    },
  });
}

/**
 * Get user's saved comparisons
 */
export async function getSavedComparisons(
  userId: string
): Promise<SavedComparison[]> {
  return prisma.savedComparison.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
}

/**
 * Save a comparison
 */
export async function saveComparison(
  userId: string,
  name: string,
  packages: string[],
  period: string
): Promise<SavedComparison> {
  return prisma.savedComparison.create({
    data: {
      userId,
      name,
      packages,
      period,
    },
  });
}

/**
 * Update a saved comparison
 */
export async function updateComparison(
  id: string,
  userId: string,
  data: { name?: string; packages?: string[]; period?: string }
): Promise<SavedComparison> {
  return prisma.savedComparison.update({
    where: { id, userId }, // Ensure user owns the comparison
    data,
  });
}

/**
 * Delete a saved comparison
 */
export async function deleteComparison(
  id: string,
  userId: string
): Promise<void> {
  await prisma.savedComparison.delete({
    where: { id, userId },
  });
}
```

### 20.4 RTK Query API Definition

```typescript
// store/api/packagesApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { PackageMetadata, DownloadData, SearchResult } from "@/types";

export const packagesApi = createApi({
  reducerPath: "packagesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Package", "Downloads", "Search", "Favorites"],
  endpoints: (builder) => ({
    // Search packages
    searchPackages: builder.query<SearchResult[], string>({
      query: (query) => `packages/search?q=${encodeURIComponent(query)}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ name }) => ({ type: "Search" as const, id: name })),
              { type: "Search", id: "LIST" },
            ]
          : [{ type: "Search", id: "LIST" }],
    }),

    // Get package metadata
    getPackageMetadata: builder.query<PackageMetadata, string>({
      query: (packageName) => `packages/${encodeURIComponent(packageName)}`,
      providesTags: (result, error, packageName) => [
        { type: "Package", id: packageName },
      ],
    }),

    // Get download statistics
    getDownloads: builder.query<
      DownloadData,
      { packages: string[]; period: string }
    >({
      query: ({ packages, period }) => ({
        url: "downloads",
        method: "POST",
        body: { packages, period },
      }),
      providesTags: (result, error, { packages }) =>
        packages.map((pkg) => ({ type: "Downloads" as const, id: pkg })),
    }),

    // Get user favorites
    getFavorites: builder.query<string[], void>({
      query: () => "user/favorites",
      providesTags: [{ type: "Favorites", id: "LIST" }],
    }),

    // Add to favorites
    addFavorite: builder.mutation<void, string>({
      query: (packageName) => ({
        url: "user/favorites",
        method: "POST",
        body: { package: packageName },
      }),
      invalidatesTags: [{ type: "Favorites", id: "LIST" }],
      // Optimistic update
      async onQueryStarted(packageName, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          packagesApi.util.updateQueryData("getFavorites", undefined, (draft) => {
            draft.push(packageName);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    // Remove from favorites
    removeFavorite: builder.mutation<void, string>({
      query: (packageName) => ({
        url: `user/favorites/${encodeURIComponent(packageName)}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Favorites", id: "LIST" }],
      // Optimistic update
      async onQueryStarted(packageName, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          packagesApi.util.updateQueryData("getFavorites", undefined, (draft) => {
            const index = draft.indexOf(packageName);
            if (index !== -1) draft.splice(index, 1);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useSearchPackagesQuery,
  useGetPackageMetadataQuery,
  useGetDownloadsQuery,
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} = packagesApi;
```

---

## 21. Performance Optimization (Iteration 14)

### 21.1 Core Web Vitals Targets

| Metric | Target | Measurement Tool |
|--------|--------|-----------------|
| LCP (Largest Contentful Paint) | < 2.5s | Lighthouse, Web Vitals |
| FID (First Input Delay) | < 100ms | Web Vitals |
| CLS (Cumulative Layout Shift) | < 0.1 | Lighthouse |
| INP (Interaction to Next Paint) | < 200ms | Web Vitals |
| TTFB (Time to First Byte) | < 800ms | Server metrics |

### 21.2 Bundle Optimization

```typescript
// next.config.ts
import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  // Enable experimental features
  experimental: {
    optimizePackageImports: [
      "@radix-ui/react-icons",
      "lucide-react",
      "recharts",
    ],
  },

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  // Headers for caching
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
      {
        source: "/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Webpack optimization
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          recharts: {
            test: /[\\/]node_modules[\\/]recharts[\\/]/,
            name: "recharts",
            chunks: "all",
            priority: 20,
          },
          radix: {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            name: "radix",
            chunks: "all",
            priority: 15,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
            priority: 10,
          },
        },
      };
    }
    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
```

### 21.3 Dynamic Imports

```typescript
// components/charts/DynamicChart.tsx
"use client";

import dynamic from "next/dynamic";
import { ChartSkeleton } from "./ChartSkeleton";

// Lazy load Recharts components
export const LazyLineChart = dynamic(
  () => import("recharts").then((mod) => mod.LineChart),
  {
    loading: () => <ChartSkeleton />,
    ssr: false, // Disable SSR for chart
  }
);

export const LazyResponsiveContainer = dynamic(
  () => import("recharts").then((mod) => mod.ResponsiveContainer),
  { ssr: false }
);

export const LazyTooltip = dynamic(
  () => import("recharts").then((mod) => mod.Tooltip),
  { ssr: false }
);

// Usage in parent component
export function ChartWrapper({ data }: { data: unknown[] }) {
  return (
    <LazyResponsiveContainer width="100%" height={400}>
      <LazyLineChart data={data}>
        {/* Chart configuration */}
      </LazyLineChart>
    </LazyResponsiveContainer>
  );
}
```

### 21.4 Data Prefetching

```typescript
// app/page.tsx
import { prefetch } from "@/lib/prefetch";

// Prefetch popular packages on homepage
export default async function HomePage() {
  // Prefetch data for commonly compared packages
  const popularPackages = ["react", "vue", "angular", "svelte"];

  // Trigger prefetch in parallel (fire and forget)
  prefetch.downloads(popularPackages, "1y");

  return (
    <main>
      {/* Page content */}
    </main>
  );
}

// lib/prefetch.ts
import { cache } from "react";

export const prefetch = {
  downloads: cache(async (packages: string[], period: string) => {
    const url = new URL("/api/downloads", process.env.NEXT_PUBLIC_BASE_URL);
    url.searchParams.set("packages", packages.join(","));
    url.searchParams.set("period", period);

    // Warm the cache
    await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
  }),

  metadata: cache(async (packageName: string) => {
    const url = new URL(
      `/api/packages/${packageName}`,
      process.env.NEXT_PUBLIC_BASE_URL
    );

    await fetch(url, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    });
  }),
};
```

### 21.5 Image Optimization

```typescript
// components/ui/OptimizedImage.tsx
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        className={cn(
          "duration-700 ease-in-out",
          isLoading
            ? "scale-105 blur-lg grayscale"
            : "scale-100 blur-0 grayscale-0"
        )}
        onLoad={() => setIsLoading(false)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}
```

### 21.6 Memoization Strategy

```typescript
// hooks/useMemoizedChartData.ts
import { useMemo } from "react";
import { DownloadData, ChartDataPoint } from "@/types";

/**
 * Memoize chart data transformation to prevent unnecessary recalculations
 */
export function useMemoizedChartData(
  downloads: DownloadData | undefined,
  packages: string[]
): ChartDataPoint[] {
  return useMemo(() => {
    if (!downloads) return [];

    // Transform API response to chart format
    const dateMap = new Map<string, ChartDataPoint>();

    packages.forEach((pkg) => {
      const pkgData = downloads[pkg];
      if (!pkgData?.downloads) return;

      pkgData.downloads.forEach(({ day, downloads }) => {
        const existing = dateMap.get(day) || { date: day };
        dateMap.set(day, { ...existing, [pkg]: downloads });
      });
    });

    // Sort by date and return
    return Array.from(dateMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [downloads, packages]);
}

// components/charts/DownloadChart.tsx
import { memo } from "react";
import { useMemoizedChartData } from "@/hooks/useMemoizedChartData";

interface DownloadChartProps {
  downloads: DownloadData;
  packages: string[];
}

// Memoize entire chart component
export const DownloadChart = memo(function DownloadChart({
  downloads,
  packages,
}: DownloadChartProps) {
  const chartData = useMemoizedChartData(downloads, packages);

  // Chart rendering...
});

// Custom comparison function for memo
DownloadChart.displayName = "DownloadChart";
```

### 21.7 Service Worker for Offline Support

```typescript
// public/sw.js
const CACHE_NAME = "npm-trends-v1";
const STATIC_CACHE = "npm-trends-static-v1";
const DYNAMIC_CACHE = "npm-trends-dynamic-v1";

const STATIC_ASSETS = [
  "/",
  "/offline",
  "/manifest.json",
];

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Fetch event with stale-while-revalidate strategy
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API requests: Network first, fallback to cache
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone and cache successful responses
          if (response.ok) {
            const clonedResponse = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, clonedResponse);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

  // Static assets: Cache first
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached, but update in background
        fetch(request).then((response) => {
          caches.open(STATIC_CACHE).then((cache) => {
            cache.put(request, response);
          });
        });
        return cachedResponse;
      }
      return fetch(request);
    })
  );
});

// Activate event - clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
});
```

---

## 22. Scalability Architecture (Iteration 15)

### 22.1 Horizontal Scaling Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                        CDN (Vercel Edge)                        │
│                    Static Assets + Edge Caching                 │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Load Balancer (Vercel)                     │
│                    Automatic Region Routing                     │
└─────────────────────────────────────────────────────────────────┘
                                  │
                ┌─────────────────┼─────────────────┐
                ▼                 ▼                 ▼
         ┌──────────┐      ┌──────────┐      ┌──────────┐
         │ Region 1 │      │ Region 2 │      │ Region 3 │
         │  (iad1)  │      │  (sfo1)  │      │  (hnd1)  │
         └──────────┘      └──────────┘      └──────────┘
                │                 │                 │
                └─────────────────┼─────────────────┘
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Upstash Redis                              │
│                    Global Distributed Cache                     │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PostgreSQL (Neon/Supabase)                   │
│                       Primary + Read Replicas                   │
└─────────────────────────────────────────────────────────────────┘
```

### 22.2 Rate Limiting Implementation

```typescript
// lib/rate-limiter.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Different rate limits for different endpoints
export const rateLimiters = {
  // General API: 100 requests per minute
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "1 m"),
    analytics: true,
    prefix: "ratelimit:api",
  }),

  // Search: 30 requests per minute
  search: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, "1 m"),
    analytics: true,
    prefix: "ratelimit:search",
  }),

  // Downloads: 60 requests per minute
  downloads: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, "1 m"),
    analytics: true,
    prefix: "ratelimit:downloads",
  }),

  // Auth: 10 requests per minute (strict)
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),
    analytics: true,
    prefix: "ratelimit:auth",
  }),
};

// Middleware helper
export async function checkRateLimit(
  identifier: string,
  limiter: keyof typeof rateLimiters
): Promise<{ success: boolean; remaining: number; reset: number }> {
  const result = await rateLimiters[limiter].limit(identifier);

  return {
    success: result.success,
    remaining: result.remaining,
    reset: result.reset,
  };
}

// API Route usage
// app/api/downloads/route.ts
import { checkRateLimit } from "@/lib/rate-limiter";
import { headers } from "next/headers";

export async function POST(request: Request) {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") ?? "anonymous";

  const { success, remaining, reset } = await checkRateLimit(ip, "downloads");

  if (!success) {
    return new Response(
      JSON.stringify({ error: "Too many requests" }),
      {
        status: 429,
        headers: {
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
          "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  // Process request...
}
```

### 22.3 Connection Pooling

```typescript
// lib/db/pool.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

// Enable WebSocket for Neon
neonConfig.webSocketConstructor = ws;

// Connection pool configuration
const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  max: 10, // Maximum connections
  idleTimeoutMillis: 30000, // Close idle connections after 30s
  connectionTimeoutMillis: 10000, // Connection timeout
};

// Create pool singleton
const globalForPool = globalThis as unknown as {
  pool: Pool | undefined;
  prisma: PrismaClient | undefined;
};

const pool = globalForPool.pool ?? new Pool(poolConfig);

if (process.env.NODE_ENV !== "production") {
  globalForPool.pool = pool;
}

// Prisma with Neon adapter
const adapter = new PrismaNeon(pool);

export const prisma =
  globalForPool.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPool.prisma = prisma;
}

// Health check
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

// Graceful shutdown
export async function closeConnections(): Promise<void> {
  await prisma.$disconnect();
  await pool.end();
}
```

### 22.4 Queue-Based Processing

```typescript
// lib/queue/download-processor.ts
import { Queue } from "bullmq";
import { Redis } from "ioredis";

const connection = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});

// Create download processing queue
export const downloadQueue = new Queue("download-stats", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: 100,
    removeOnFail: 50,
  },
});

// Add job to queue
export async function queueDownloadFetch(packages: string[]): Promise<string> {
  const job = await downloadQueue.add(
    "fetch-downloads",
    { packages },
    {
      priority: packages.length > 5 ? 10 : 1, // Lower priority for bulk
      jobId: `downloads-${packages.sort().join("-")}`, // Dedupe
    }
  );
  return job.id!;
}

// Worker (separate process)
// workers/download-worker.ts
import { Worker } from "bullmq";
import { fetchDownloadsFromNpm } from "@/lib/npm-api";
import { updateDownloadCache } from "@/lib/db/packages";

const worker = new Worker(
  "download-stats",
  async (job) => {
    const { packages } = job.data;

    for (const pkg of packages) {
      const data = await fetchDownloadsFromNpm(pkg);
      await updateDownloadCache(pkg, "daily", data.start, data.end, data);

      // Update progress
      await job.updateProgress((packages.indexOf(pkg) + 1) / packages.length * 100);
    }

    return { processed: packages.length };
  },
  {
    connection,
    concurrency: 5, // Process 5 packages at a time
    limiter: {
      max: 20, // Max 20 jobs per second
      duration: 1000,
    },
  }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});
```

---

## 23. Error Handling & Recovery (Iteration 16)

### 23.1 Error Boundary Implementation

```typescript
// components/error/ErrorBoundary.tsx
"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log to error reporting service
    console.error("Error caught by boundary:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">
            {this.state.error?.message || "An unexpected error occurred"}
          </p>
          <Button onClick={this.handleRetry} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 23.2 API Error Handler

```typescript
// lib/errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR", 400);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, "NOT_FOUND", 404);
  }
}

export class RateLimitError extends AppError {
  constructor(retryAfter: number) {
    super("Rate limit exceeded", "RATE_LIMIT", 429);
    this.retryAfter = retryAfter;
  }
  retryAfter: number;
}

export class ExternalServiceError extends AppError {
  constructor(service: string, originalError?: Error) {
    super(
      `External service error: ${service}`,
      "EXTERNAL_SERVICE_ERROR",
      502
    );
    this.originalError = originalError;
  }
  originalError?: Error;
}

// API error response helper
export function createErrorResponse(error: unknown): Response {
  if (error instanceof AppError) {
    return new Response(
      JSON.stringify({
        error: error.message,
        code: error.code,
      }),
      {
        status: error.statusCode,
        headers: {
          "Content-Type": "application/json",
          ...(error instanceof RateLimitError
            ? { "Retry-After": error.retryAfter.toString() }
            : {}),
        },
      }
    );
  }

  // Unknown error - don't expose details in production
  console.error("Unhandled error:", error);

  return new Response(
    JSON.stringify({
      error: "Internal server error",
      code: "INTERNAL_ERROR",
    }),
    {
      status: 500,
      headers: { "Content-Type": "application/json" },
    }
  );
}
```

### 23.3 Retry Logic with Exponential Backoff

```typescript
// lib/retry.ts
interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  shouldRetry?: (error: Error, attempt: number) => boolean;
  onRetry?: (error: Error, attempt: number) => void;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 30000,
  shouldRetry: (error) => {
    // Retry on network errors and 5xx status codes
    if (error instanceof TypeError) return true; // Network error
    if ("status" in error) {
      const status = (error as { status: number }).status;
      return status >= 500 || status === 429;
    }
    return false;
  },
  onRetry: () => {},
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= opts.maxRetries + 1; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt > opts.maxRetries || !opts.shouldRetry(lastError, attempt)) {
        throw lastError;
      }

      // Calculate delay with exponential backoff and jitter
      const delay = Math.min(
        opts.baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000,
        opts.maxDelay
      );

      opts.onRetry(lastError, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

// Usage example
const data = await withRetry(
  () => fetch("https://api.npmjs.org/downloads/...").then((r) => r.json()),
  {
    maxRetries: 3,
    onRetry: (error, attempt) => {
      console.warn(`Retry attempt ${attempt}:`, error.message);
    },
  }
);
```

### 23.4 Circuit Breaker Pattern

```typescript
// lib/circuit-breaker.ts
type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

interface CircuitBreakerOptions {
  failureThreshold: number;
  successThreshold: number;
  timeout: number;
  onStateChange?: (from: CircuitState, to: CircuitState) => void;
}

export class CircuitBreaker {
  private state: CircuitState = "CLOSED";
  private failures = 0;
  private successes = 0;
  private lastFailure: number | null = null;

  constructor(private options: CircuitBreakerOptions) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === "OPEN") {
      if (Date.now() - (this.lastFailure ?? 0) > this.options.timeout) {
        this.transition("HALF_OPEN");
      } else {
        throw new Error("Circuit breaker is OPEN");
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;

    if (this.state === "HALF_OPEN") {
      this.successes++;
      if (this.successes >= this.options.successThreshold) {
        this.transition("CLOSED");
      }
    }
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailure = Date.now();
    this.successes = 0;

    if (this.failures >= this.options.failureThreshold) {
      this.transition("OPEN");
    }
  }

  private transition(newState: CircuitState): void {
    const oldState = this.state;
    this.state = newState;
    this.options.onStateChange?.(oldState, newState);
  }

  getState(): CircuitState {
    return this.state;
  }
}

// Usage with npm API
const npmCircuitBreaker = new CircuitBreaker({
  failureThreshold: 5,
  successThreshold: 2,
  timeout: 30000,
  onStateChange: (from, to) => {
    console.log(`Circuit breaker: ${from} -> ${to}`);
  },
});

export async function fetchWithCircuitBreaker<T>(
  url: string
): Promise<T> {
  return npmCircuitBreaker.execute(async () => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  });
}
```

---

## 24. Monitoring & Observability (Iteration 17)

### 24.1 Logging Configuration

```typescript
// lib/logger.ts
import pino from "pino";

const isDevelopment = process.env.NODE_ENV === "development";

export const logger = pino({
  level: process.env.LOG_LEVEL || (isDevelopment ? "debug" : "info"),
  transport: isDevelopment
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
        },
      }
    : undefined,
  base: {
    env: process.env.NODE_ENV,
    version: process.env.NEXT_PUBLIC_APP_VERSION,
  },
  formatters: {
    level: (label) => ({ level: label }),
  },
  redact: ["req.headers.authorization", "req.headers.cookie", "password", "token"],
});

// Request logger
export function createRequestLogger(req: Request) {
  return logger.child({
    requestId: crypto.randomUUID(),
    method: req.method,
    url: req.url,
  });
}

// Structured logging helpers
export const loggers = {
  api: logger.child({ component: "api" }),
  db: logger.child({ component: "database" }),
  cache: logger.child({ component: "cache" }),
  npm: logger.child({ component: "npm-api" }),
  auth: logger.child({ component: "auth" }),
};
```

### 24.2 Performance Monitoring

```typescript
// lib/monitoring/performance.ts
import { logger } from "@/lib/logger";

interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private timers = new Map<string, number>();

  startTimer(name: string): void {
    this.timers.set(name, performance.now());
  }

  endTimer(name: string, metadata?: Record<string, unknown>): number {
    const start = this.timers.get(name);
    if (!start) {
      logger.warn({ name }, "Timer not found");
      return 0;
    }

    const duration = performance.now() - start;
    this.timers.delete(name);

    const metric: PerformanceMetric = {
      name,
      duration,
      timestamp: Date.now(),
      metadata,
    };

    this.metrics.push(metric);
    this.reportMetric(metric);

    return duration;
  }

  private reportMetric(metric: PerformanceMetric): void {
    // Log slow operations
    if (metric.duration > 1000) {
      logger.warn(
        { ...metric, slow: true },
        `Slow operation: ${metric.name} took ${metric.duration}ms`
      );
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === "production") {
      // Send to Vercel Analytics or other service
      this.sendToAnalytics(metric);
    }
  }

  private async sendToAnalytics(metric: PerformanceMetric): Promise<void> {
    // Implementation depends on analytics provider
    try {
      await fetch("/api/analytics/performance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metric),
      });
    } catch {
      // Silently fail - don't break the app for analytics
    }
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  clearMetrics(): void {
    this.metrics = [];
  }
}

export const performanceMonitor = new PerformanceMonitor();

// HOF for timing async functions
export function withTiming<T extends (...args: unknown[]) => Promise<unknown>>(
  name: string,
  fn: T
): T {
  return (async (...args: Parameters<T>) => {
    performanceMonitor.startTimer(name);
    try {
      return await fn(...args);
    } finally {
      performanceMonitor.endTimer(name);
    }
  }) as T;
}
```

### 24.3 Health Check Endpoint

```typescript
// app/api/health/route.ts
import { NextResponse } from "next/server";
import { checkDatabaseHealth } from "@/lib/db/pool";
import { Redis } from "@upstash/redis";
import { logger } from "@/lib/logger";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  version: string;
  checks: {
    database: CheckResult;
    cache: CheckResult;
    npmApi: CheckResult;
  };
}

interface CheckResult {
  status: "up" | "down";
  latency?: number;
  error?: string;
}

async function checkDatabase(): Promise<CheckResult> {
  const start = performance.now();
  try {
    const healthy = await checkDatabaseHealth();
    return {
      status: healthy ? "up" : "down",
      latency: performance.now() - start,
    };
  } catch (error) {
    return {
      status: "down",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function checkCache(): Promise<CheckResult> {
  const start = performance.now();
  try {
    await redis.ping();
    return {
      status: "up",
      latency: performance.now() - start,
    };
  } catch (error) {
    return {
      status: "down",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function checkNpmApi(): Promise<CheckResult> {
  const start = performance.now();
  try {
    const response = await fetch(
      "https://api.npmjs.org/downloads/point/last-day/react",
      { signal: AbortSignal.timeout(5000) }
    );
    return {
      status: response.ok ? "up" : "down",
      latency: performance.now() - start,
    };
  } catch (error) {
    return {
      status: "down",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function GET(): Promise<NextResponse<HealthStatus>> {
  const [database, cache, npmApi] = await Promise.all([
    checkDatabase(),
    checkCache(),
    checkNpmApi(),
  ]);

  const checks = { database, cache, npmApi };
  const allUp = Object.values(checks).every((c) => c.status === "up");
  const anyDown = Object.values(checks).some((c) => c.status === "down");

  const status: HealthStatus = {
    status: allUp ? "healthy" : anyDown ? "unhealthy" : "degraded",
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_APP_VERSION || "unknown",
    checks,
  };

  // Log unhealthy status
  if (status.status !== "healthy") {
    logger.warn({ health: status }, "Health check detected issues");
  }

  return NextResponse.json(status, {
    status: status.status === "healthy" ? 200 : 503,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
```

### 24.4 Web Vitals Reporting

```typescript
// lib/monitoring/web-vitals.ts
"use client";

import { onCLS, onFID, onLCP, onINP, onTTFB, type Metric } from "web-vitals";

type MetricName = "CLS" | "FID" | "LCP" | "INP" | "TTFB";

interface VitalMetric {
  name: MetricName;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  id: string;
}

function sendToAnalytics(metric: VitalMetric): void {
  // Send to analytics endpoint
  const body = JSON.stringify({
    ...metric,
    page: window.location.pathname,
    timestamp: Date.now(),
  });

  // Use sendBeacon for reliability
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/analytics/vitals", body);
  } else {
    fetch("/api/analytics/vitals", {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
      keepalive: true,
    });
  }
}

function handleMetric(metric: Metric): void {
  const vitalMetric: VitalMetric = {
    name: metric.name as MetricName,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
  };

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log(`[Web Vital] ${metric.name}:`, metric.value, metric.rating);
  }

  sendToAnalytics(vitalMetric);
}

export function reportWebVitals(): void {
  onCLS(handleMetric);
  onFID(handleMetric);
  onLCP(handleMetric);
  onINP(handleMetric);
  onTTFB(handleMetric);
}

// Usage in app layout
// app/layout.tsx
import { useEffect } from "react";
import { reportWebVitals } from "@/lib/monitoring/web-vitals";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    reportWebVitals();
  }, []);

  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

---

## 25. Caching Strategy (Iteration 18)

### 25.1 Multi-Layer Cache Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Browser Cache (Client)                      │
│           Service Worker + HTTP Cache-Control Headers           │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                       CDN Edge Cache                            │
│               Vercel Edge Network (Global POPs)                 │
│                  TTL: Static (1y), Dynamic (1h)                 │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Application Cache                           │
│                 Upstash Redis - Global                          │
│              TTL: Metadata (24h), Downloads (1h)                │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Database Cache                             │
│            PostgreSQL + Prisma Query Caching                    │
└─────────────────────────────────────────────────────────────────┘
```

### 25.2 Cache Service Implementation

```typescript
// lib/cache/cache-service.ts
import { Redis } from "@upstash/redis";
import { logger } from "@/lib/logger";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

interface CacheOptions {
  ttl?: number; // Time to live in seconds
  tags?: string[]; // Cache tags for invalidation
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  tags: string[];
}

const DEFAULT_TTL = 3600; // 1 hour

export const cacheService = {
  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const entry = await redis.get<CacheEntry<T>>(key);
      if (!entry) return null;

      logger.debug({ key }, "Cache hit");
      return entry.data;
    } catch (error) {
      logger.error({ key, error }, "Cache get error");
      return null;
    }
  },

  /**
   * Set value in cache
   */
  async set<T>(key: string, data: T, options: CacheOptions = {}): Promise<void> {
    const { ttl = DEFAULT_TTL, tags = [] } = options;

    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        tags,
      };

      await redis.set(key, entry, { ex: ttl });

      // Store tag mappings for invalidation
      for (const tag of tags) {
        await redis.sadd(`tag:${tag}`, key);
        await redis.expire(`tag:${tag}`, ttl * 2); // Tags expire after entries
      }

      logger.debug({ key, ttl, tags }, "Cache set");
    } catch (error) {
      logger.error({ key, error }, "Cache set error");
    }
  },

  /**
   * Delete specific key from cache
   */
  async delete(key: string): Promise<void> {
    try {
      await redis.del(key);
      logger.debug({ key }, "Cache deleted");
    } catch (error) {
      logger.error({ key, error }, "Cache delete error");
    }
  },

  /**
   * Invalidate all entries with a specific tag
   */
  async invalidateByTag(tag: string): Promise<number> {
    try {
      const keys = await redis.smembers(`tag:${tag}`);
      if (keys.length === 0) return 0;

      await redis.del(...keys, `tag:${tag}`);
      logger.info({ tag, count: keys.length }, "Cache invalidated by tag");
      return keys.length;
    } catch (error) {
      logger.error({ tag, error }, "Cache invalidation error");
      return 0;
    }
  },

  /**
   * Get or set with callback
   */
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) return cached;

    const data = await fetcher();
    await this.set(key, data, options);
    return data;
  },
};

// Cache key generators
export const cacheKeys = {
  packageMetadata: (name: string) => `pkg:meta:${name}`,
  packageDownloads: (name: string, period: string) => `pkg:dl:${name}:${period}`,
  searchResults: (query: string) => `search:${query.toLowerCase()}`,
  userFavorites: (userId: string) => `user:fav:${userId}`,
  popularPackages: () => "popular:packages",
};

// Cache tags
export const cacheTags = {
  package: (name: string) => `package:${name}`,
  user: (userId: string) => `user:${userId}`,
  downloads: "downloads",
  search: "search",
};
```

### 25.3 Stale-While-Revalidate Pattern

```typescript
// lib/cache/swr-cache.ts
import { cacheService, cacheKeys } from "./cache-service";
import { logger } from "@/lib/logger";

interface SWROptions {
  staleTime: number; // Time until data is considered stale (seconds)
  maxAge: number; // Maximum age before data is deleted (seconds)
  revalidateOnStale?: boolean;
}

interface SWREntry<T> {
  data: T;
  timestamp: number;
  isRevalidating: boolean;
}

const revalidationLocks = new Set<string>();

export async function getWithSWR<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: SWROptions
): Promise<T> {
  const { staleTime, maxAge, revalidateOnStale = true } = options;

  // Try to get cached data
  const cached = await cacheService.get<SWREntry<T>>(key);

  if (cached) {
    const age = (Date.now() - cached.timestamp) / 1000;

    // Fresh data - return immediately
    if (age < staleTime) {
      return cached.data;
    }

    // Stale but within max age - return stale and revalidate in background
    if (age < maxAge && revalidateOnStale) {
      // Trigger background revalidation if not already running
      if (!revalidationLocks.has(key)) {
        revalidateInBackground(key, fetcher, options);
      }
      return cached.data;
    }
  }

  // No valid cache - fetch fresh data
  return fetchAndCache(key, fetcher, options);
}

async function fetchAndCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: SWROptions
): Promise<T> {
  const data = await fetcher();

  const entry: SWREntry<T> = {
    data,
    timestamp: Date.now(),
    isRevalidating: false,
  };

  await cacheService.set(key, entry, { ttl: options.maxAge });
  return data;
}

async function revalidateInBackground<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: SWROptions
): Promise<void> {
  // Prevent concurrent revalidations
  if (revalidationLocks.has(key)) return;
  revalidationLocks.add(key);

  try {
    logger.debug({ key }, "Starting background revalidation");
    await fetchAndCache(key, fetcher, options);
    logger.debug({ key }, "Background revalidation complete");
  } catch (error) {
    logger.error({ key, error }, "Background revalidation failed");
  } finally {
    revalidationLocks.delete(key);
  }
}

// Usage example
export async function getPackageDownloads(
  packageName: string,
  period: string
): Promise<DownloadData> {
  return getWithSWR(
    cacheKeys.packageDownloads(packageName, period),
    () => fetchFromNpmApi(packageName, period),
    {
      staleTime: 300, // 5 minutes
      maxAge: 3600, // 1 hour
      revalidateOnStale: true,
    }
  );
}
```

### 25.4 Cache Warming Strategy

```typescript
// lib/cache/cache-warmer.ts
import { cacheService, cacheKeys, cacheTags } from "./cache-service";
import { fetchPackageMetadata, fetchDownloads } from "@/lib/npm-api";
import { logger } from "@/lib/logger";

// Popular packages to pre-warm
const POPULAR_PACKAGES = [
  "react",
  "vue",
  "angular",
  "svelte",
  "next",
  "nuxt",
  "express",
  "fastify",
  "lodash",
  "axios",
  "typescript",
  "webpack",
  "vite",
  "esbuild",
  "tailwindcss",
];

const COMMON_PERIODS = ["1w", "1m", "3m", "6m", "1y"];

export async function warmCache(): Promise<void> {
  logger.info("Starting cache warming...");
  const startTime = Date.now();

  try {
    // Warm metadata cache
    await Promise.all(
      POPULAR_PACKAGES.map(async (pkg) => {
        const key = cacheKeys.packageMetadata(pkg);
        const cached = await cacheService.get(key);

        if (!cached) {
          const metadata = await fetchPackageMetadata(pkg);
          await cacheService.set(key, metadata, {
            ttl: 86400, // 24 hours
            tags: [cacheTags.package(pkg)],
          });
        }
      })
    );

    // Warm downloads cache for common periods
    await Promise.all(
      POPULAR_PACKAGES.flatMap((pkg) =>
        COMMON_PERIODS.map(async (period) => {
          const key = cacheKeys.packageDownloads(pkg, period);
          const cached = await cacheService.get(key);

          if (!cached) {
            const downloads = await fetchDownloads(pkg, period);
            await cacheService.set(key, downloads, {
              ttl: 3600, // 1 hour
              tags: [cacheTags.package(pkg), cacheTags.downloads],
            });
          }
        })
      )
    );

    const duration = Date.now() - startTime;
    logger.info(
      { duration, packages: POPULAR_PACKAGES.length },
      "Cache warming complete"
    );
  } catch (error) {
    logger.error({ error }, "Cache warming failed");
  }
}

// Schedule cache warming (can be called from cron job)
// Vercel Cron: vercel.json
// { "crons": [{ "path": "/api/cron/warm-cache", "schedule": "0 * * * *" }] }
```

### 25.5 Cache Invalidation Strategies

```typescript
// lib/cache/invalidation.ts
import { cacheService, cacheTags } from "./cache-service";
import { logger } from "@/lib/logger";

export const cacheInvalidation = {
  /**
   * Invalidate all caches for a specific package
   */
  async invalidatePackage(packageName: string): Promise<void> {
    const tag = cacheTags.package(packageName);
    const count = await cacheService.invalidateByTag(tag);
    logger.info({ packageName, count }, "Package cache invalidated");
  },

  /**
   * Invalidate all download caches (e.g., after npm API update)
   */
  async invalidateAllDownloads(): Promise<void> {
    const count = await cacheService.invalidateByTag(cacheTags.downloads);
    logger.info({ count }, "All download caches invalidated");
  },

  /**
   * Invalidate user-specific caches
   */
  async invalidateUser(userId: string): Promise<void> {
    const tag = cacheTags.user(userId);
    const count = await cacheService.invalidateByTag(tag);
    logger.info({ userId, count }, "User cache invalidated");
  },

  /**
   * Scheduled invalidation for stale data
   */
  async cleanupStaleEntries(): Promise<void> {
    // This runs as a cron job to clean up expired entries
    // Upstash Redis handles TTL expiration automatically
    logger.info("Stale cache cleanup triggered");
  },
};

// API endpoint for manual cache invalidation (admin only)
// app/api/admin/cache/invalidate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cacheInvalidation } from "@/lib/cache/invalidation";
import { verifyAdminAccess } from "@/lib/auth";

export async function POST(request: NextRequest) {
  // Verify admin access
  const isAdmin = await verifyAdminAccess(request);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type, target } = await request.json();

  switch (type) {
    case "package":
      await cacheInvalidation.invalidatePackage(target);
      break;
    case "downloads":
      await cacheInvalidation.invalidateAllDownloads();
      break;
    case "user":
      await cacheInvalidation.invalidateUser(target);
      break;
    default:
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
```

---

## 26. Security Implementation (Iteration 19)

### 26.1 Security Headers Configuration

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security Headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  );

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://api.npmjs.org https://*.vercel-analytics.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);

  // CORS for API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    response.headers.set("Access-Control-Allow-Origin", process.env.NEXT_PUBLIC_APP_URL || "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

### 26.2 Input Validation with Zod

```typescript
// lib/validation/schemas.ts
import { z } from "zod";

// Package name validation
export const packageNameSchema = z
  .string()
  .min(1, "Package name is required")
  .max(214, "Package name too long")
  .regex(
    /^(?:@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/,
    "Invalid package name format"
  );

// Search query validation
export const searchQuerySchema = z.object({
  q: z.string().min(1).max(100).trim(),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

// Download request validation
export const downloadRequestSchema = z.object({
  packages: z
    .array(packageNameSchema)
    .min(1, "At least one package is required")
    .max(10, "Maximum 10 packages allowed"),
  period: z.enum(["1w", "1m", "3m", "6m", "1y", "2y"]),
});

// User preferences validation
export const userPreferencesSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).default("system"),
  chartType: z.enum(["line", "area", "bar"]).default("line"),
  defaultPeriod: z.enum(["1w", "1m", "3m", "6m", "1y", "2y"]).default("1y"),
});

// Comparison save validation
export const saveComparisonSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  packages: z.array(packageNameSchema).min(2).max(10),
  period: z.enum(["1w", "1m", "3m", "6m", "1y", "2y"]),
});

// Validate and parse helper
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}
```

### 26.3 CSRF Protection

```typescript
// lib/security/csrf.ts
import { randomBytes, createHmac } from "crypto";
import { cookies } from "next/headers";

const CSRF_TOKEN_NAME = "csrf_token";
const CSRF_SECRET = process.env.CSRF_SECRET!;

export function generateCsrfToken(): string {
  const token = randomBytes(32).toString("hex");
  const signature = createHmac("sha256", CSRF_SECRET)
    .update(token)
    .digest("hex");
  return `${token}.${signature}`;
}

export function validateCsrfToken(token: string | null): boolean {
  if (!token) return false;

  const [value, signature] = token.split(".");
  if (!value || !signature) return false;

  const expectedSignature = createHmac("sha256", CSRF_SECRET)
    .update(value)
    .digest("hex");

  return signature === expectedSignature;
}

// Server action wrapper with CSRF
export function withCsrf<T extends unknown[], R>(
  action: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
  return async (...args: T) => {
    const cookieStore = await cookies();
    const csrfCookie = cookieStore.get(CSRF_TOKEN_NAME);

    if (!validateCsrfToken(csrfCookie?.value ?? null)) {
      throw new Error("Invalid CSRF token");
    }

    return action(...args);
  };
}
```

### 26.4 API Key Management

```typescript
// lib/security/api-keys.ts
import { Redis } from "@upstash/redis";
import { randomBytes, createHash } from "crypto";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

interface ApiKey {
  id: string;
  hashedKey: string;
  userId: string;
  name: string;
  permissions: string[];
  createdAt: Date;
  lastUsed: Date | null;
  expiresAt: Date | null;
}

function hashApiKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

export const apiKeyService = {
  async create(
    userId: string,
    name: string,
    permissions: string[],
    expiresInDays?: number
  ): Promise<{ key: string; keyId: string }> {
    const keyId = `key_${randomBytes(8).toString("hex")}`;
    const rawKey = `npm_trends_${randomBytes(32).toString("hex")}`;
    const hashedKey = hashApiKey(rawKey);

    const apiKey: ApiKey = {
      id: keyId,
      hashedKey,
      userId,
      name,
      permissions,
      createdAt: new Date(),
      lastUsed: null,
      expiresAt: expiresInDays
        ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
        : null,
    };

    await redis.hset(`apikey:${keyId}`, apiKey);
    await redis.sadd(`user:${userId}:apikeys`, keyId);

    // Return the raw key only once - it cannot be retrieved later
    return { key: rawKey, keyId };
  },

  async validate(key: string): Promise<ApiKey | null> {
    const hashedKey = hashApiKey(key);

    // In production, you'd use a more efficient lookup
    // This is a simplified example
    const keys = await redis.keys("apikey:*");

    for (const keyName of keys) {
      const apiKey = await redis.hgetall<ApiKey>(keyName);
      if (apiKey?.hashedKey === hashedKey) {
        // Check expiration
        if (apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date()) {
          return null;
        }

        // Update last used
        await redis.hset(keyName, { lastUsed: new Date() });
        return apiKey;
      }
    }

    return null;
  },

  async revoke(userId: string, keyId: string): Promise<boolean> {
    const apiKey = await redis.hgetall<ApiKey>(`apikey:${keyId}`);
    if (!apiKey || apiKey.userId !== userId) {
      return false;
    }

    await redis.del(`apikey:${keyId}`);
    await redis.srem(`user:${userId}:apikeys`, keyId);
    return true;
  },

  async listUserKeys(userId: string): Promise<Omit<ApiKey, "hashedKey">[]> {
    const keyIds = await redis.smembers(`user:${userId}:apikeys`);
    const keys: Omit<ApiKey, "hashedKey">[] = [];

    for (const keyId of keyIds) {
      const apiKey = await redis.hgetall<ApiKey>(`apikey:${keyId}`);
      if (apiKey) {
        const { hashedKey, ...safeKey } = apiKey;
        keys.push(safeKey);
      }
    }

    return keys;
  },
};
```

---

## 27. Accessibility Audit Checklist (Iteration 20)

### 27.1 WCAG 2.1 AA Compliance Matrix

| Principle | Guideline | Requirement | Implementation |
|-----------|-----------|-------------|----------------|
| Perceivable | 1.1.1 | Non-text content has text alternative | All images have alt text |
| | 1.3.1 | Info and relationships preserved | Semantic HTML structure |
| | 1.4.1 | Color not sole conveyor of info | Icons + text for status |
| | 1.4.3 | Contrast ratio ≥ 4.5:1 | Verified with tools |
| | 1.4.4 | Text resizable to 200% | Relative units (rem) |
| Operable | 2.1.1 | Keyboard accessible | All interactions keyboard navigable |
| | 2.1.2 | No keyboard traps | Tab navigation verified |
| | 2.4.1 | Skip links provided | Skip to main content |
| | 2.4.3 | Focus order logical | Tab index managed |
| | 2.4.7 | Focus visible | Custom focus rings |
| Understandable | 3.1.1 | Language declared | html lang="en" |
| | 3.2.1 | Focus doesn't change context | No auto-submit on focus |
| | 3.3.1 | Errors identified | Error messages clear |
| | 3.3.2 | Labels provided | All inputs labeled |
| Robust | 4.1.1 | Valid HTML | W3C validator passed |
| | 4.1.2 | Name, role, value | ARIA attributes correct |

### 27.2 Accessibility Testing Configuration

```typescript
// tests/a11y/axe-config.ts
import { configureAxe } from "jest-axe";

export const axeConfig = configureAxe({
  rules: {
    // Ensure all images have alt text
    "image-alt": { enabled: true },
    // Check color contrast
    "color-contrast": { enabled: true },
    // Verify form labels
    "label": { enabled: true },
    // Check link purpose
    "link-name": { enabled: true },
    // Ensure buttons have accessible names
    "button-name": { enabled: true },
    // Check landmark regions
    "region": { enabled: true },
    // Verify heading order
    "heading-order": { enabled: true },
  },
});

// Storybook a11y addon config
// .storybook/preview.ts
import { withA11y } from "@storybook/addon-a11y";

export const decorators = [withA11y];

export const parameters = {
  a11y: {
    config: {
      rules: [
        {
          id: "color-contrast",
          enabled: true,
        },
        {
          id: "focus-order-semantics",
          enabled: true,
        },
      ],
    },
    options: {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21aa"],
      },
    },
  },
};
```

### 27.3 Accessible Chart Implementation

```typescript
// components/charts/AccessibleChart.tsx
"use client";

import { useLiveRegion } from "@/components/a11y/LiveRegion";
import { DownloadChart } from "./DownloadChart";
import { useEffect, useMemo } from "react";

interface AccessibleChartProps {
  data: ChartData[];
  packages: string[];
}

export function AccessibleChart({ data, packages }: AccessibleChartProps) {
  const { announce } = useLiveRegion();

  // Generate accessible summary
  const summary = useMemo(() => {
    if (!data.length) return "No data available";

    const totals = packages.map((pkg) => {
      const total = data.reduce((sum, point) => sum + (point[pkg] || 0), 0);
      return { name: pkg, total };
    });

    const sorted = totals.sort((a, b) => b.total - a.total);
    return `Chart showing download trends for ${packages.length} packages. ${sorted[0].name} has the highest downloads.`;
  }, [data, packages]);

  // Announce changes to screen readers
  useEffect(() => {
    if (data.length > 0) {
      announce(`Chart updated. ${summary}`, "polite");
    }
  }, [data, summary, announce]);

  return (
    <div role="figure" aria-label={summary}>
      {/* Hidden table for screen readers */}
      <table className="sr-only">
        <caption>Download statistics for {packages.join(", ")}</caption>
        <thead>
          <tr>
            <th scope="col">Date</th>
            {packages.map((pkg) => (
              <th key={pkg} scope="col">
                {pkg}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.slice(0, 10).map((row) => (
            <tr key={row.date}>
              <td>{row.date}</td>
              {packages.map((pkg) => (
                <td key={pkg}>{row[pkg]?.toLocaleString() || 0}</td>
              ))}
            </tr>
          ))}
          {data.length > 10 && (
            <tr>
              <td colSpan={packages.length + 1}>
                ...and {data.length - 10} more data points
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Visual chart */}
      <div aria-hidden="true">
        <DownloadChart data={data} packages={packages} />
      </div>
    </div>
  );
}
```

---

## 28. Internationalization (Iteration 21)

### 28.1 i18n Configuration

```typescript
// lib/i18n/config.ts
export const locales = ["en", "ja", "zh", "ko", "es", "de", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  ja: "日本語",
  zh: "中文",
  ko: "한국어",
  es: "Español",
  de: "Deutsch",
  fr: "Français",
};

// next.config.ts (partial)
export const i18nConfig = {
  locales,
  defaultLocale,
};
```

### 28.2 Translation Messages

```typescript
// messages/en.json
{
  "common": {
    "loading": "Loading...",
    "error": "An error occurred",
    "retry": "Try again",
    "search": "Search",
    "clear": "Clear",
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "confirm": "Confirm"
  },
  "nav": {
    "home": "Home",
    "compare": "Compare",
    "favorites": "Favorites",
    "settings": "Settings",
    "signIn": "Sign In",
    "signOut": "Sign Out"
  },
  "search": {
    "placeholder": "Search npm packages...",
    "noResults": "No packages found",
    "suggestions": "Suggestions",
    "recentSearches": "Recent searches"
  },
  "chart": {
    "downloads": "Downloads",
    "period": {
      "1w": "1 Week",
      "1m": "1 Month",
      "3m": "3 Months",
      "6m": "6 Months",
      "1y": "1 Year",
      "2y": "2 Years"
    },
    "tooltip": "{package}: {count} downloads on {date}"
  },
  "package": {
    "version": "Version",
    "license": "License",
    "repository": "Repository",
    "homepage": "Homepage",
    "weeklyDownloads": "Weekly Downloads",
    "addToComparison": "Add to comparison",
    "removeFromComparison": "Remove from comparison"
  },
  "comparison": {
    "title": "Package Comparison",
    "emptyState": "Add packages to start comparing",
    "maxPackages": "Maximum {max} packages allowed",
    "share": "Share comparison",
    "export": "Export data"
  },
  "errors": {
    "packageNotFound": "Package not found",
    "rateLimited": "Too many requests. Please try again later.",
    "networkError": "Network error. Check your connection.",
    "serverError": "Server error. Please try again."
  }
}
```

### 28.3 Translation Hook

```typescript
// lib/i18n/useTranslations.ts
"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import { Locale, defaultLocale } from "./config";

type Messages = Record<string, string | Record<string, string>>;

// Pre-loaded messages (in production, load dynamically)
const allMessages: Record<Locale, Messages> = {
  en: require("@/messages/en.json"),
  ja: require("@/messages/ja.json"),
  // ... other locales
};

export function useTranslations(namespace?: string) {
  const params = useParams();
  const locale = (params?.locale as Locale) || defaultLocale;
  const messages = allMessages[locale] || allMessages[defaultLocale];

  const t = useMemo(() => {
    return (key: string, values?: Record<string, string | number>): string => {
      const fullKey = namespace ? `${namespace}.${key}` : key;
      const keys = fullKey.split(".");
      let value: unknown = messages;

      for (const k of keys) {
        value = (value as Record<string, unknown>)?.[k];
        if (value === undefined) break;
      }

      if (typeof value !== "string") {
        console.warn(`Missing translation: ${fullKey}`);
        return fullKey;
      }

      // Replace placeholders
      if (values) {
        return value.replace(/\{(\w+)\}/g, (_, key) =>
          String(values[key] ?? `{${key}}`)
        );
      }

      return value;
    };
  }, [messages, namespace]);

  return { t, locale };
}
```

---

## 29. Analytics Integration (Iteration 22)

### 29.1 Vercel Analytics Setup

```typescript
// app/layout.tsx
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### 29.2 Custom Event Tracking

```typescript
// lib/analytics/events.ts
import { track } from "@vercel/analytics";

export const analyticsEvents = {
  // Package events
  packageSearch: (query: string, resultCount: number) => {
    track("package_search", { query, resultCount });
  },

  packageAdd: (packageName: string, source: "search" | "url" | "favorites") => {
    track("package_add", { packageName, source });
  },

  packageRemove: (packageName: string) => {
    track("package_remove", { packageName });
  },

  // Comparison events
  comparisonCreate: (packageCount: number) => {
    track("comparison_create", { packageCount });
  },

  comparisonShare: (packageCount: number, shareMethod: "url" | "embed" | "image") => {
    track("comparison_share", { packageCount, shareMethod });
  },

  comparisonSave: (packageCount: number) => {
    track("comparison_save", { packageCount });
  },

  // Chart interactions
  periodChange: (from: string, to: string) => {
    track("period_change", { from, to });
  },

  chartTypeChange: (from: string, to: string) => {
    track("chart_type_change", { from, to });
  },

  chartExport: (format: "png" | "svg" | "csv") => {
    track("chart_export", { format });
  },

  // User events
  userSignIn: (provider: string) => {
    track("user_sign_in", { provider });
  },

  userSignUp: (provider: string) => {
    track("user_sign_up", { provider });
  },

  favoriteAdd: (packageName: string) => {
    track("favorite_add", { packageName });
  },

  favoriteRemove: (packageName: string) => {
    track("favorite_remove", { packageName });
  },

  // Error events
  errorOccurred: (errorCode: string, context?: string) => {
    track("error_occurred", { errorCode, context: context || "unknown" });
  },
};
```

### 29.3 Usage Analytics Dashboard Data

```typescript
// app/api/analytics/summary/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfDay, subDays } from "date-fns";

export async function GET() {
  const thirtyDaysAgo = startOfDay(subDays(new Date(), 30));

  const [pageViews, topPackages, dailyViews] = await Promise.all([
    // Total page views
    prisma.pageView.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    }),

    // Top compared packages
    prisma.pageView.groupBy({
      by: ["packages"],
      _count: true,
      where: { createdAt: { gte: thirtyDaysAgo } },
      orderBy: { _count: { packages: "desc" } },
      take: 10,
    }),

    // Daily view counts
    prisma.$queryRaw`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM page_views
      WHERE created_at >= ${thirtyDaysAgo}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `,
  ]);

  return NextResponse.json({
    totalPageViews: pageViews,
    topPackages,
    dailyViews,
    generatedAt: new Date().toISOString(),
  });
}
```

---

## 30. Documentation Strategy (Iteration 23)

### 30.1 JSDoc Standards

```typescript
/**
 * Fetches download statistics for npm packages.
 *
 * @description
 * Retrieves daily download counts for specified packages over a given time period.
 * Data is cached and rate-limited to prevent API abuse.
 *
 * @param packages - Array of npm package names to fetch data for
 * @param period - Time period for download data (e.g., "1w", "1m", "1y")
 * @param options - Optional configuration
 * @param options.useCache - Whether to use cached data (default: true)
 * @param options.signal - AbortSignal for request cancellation
 *
 * @returns Promise resolving to download data keyed by package name
 *
 * @throws {ValidationError} If packages array is empty or contains invalid names
 * @throws {RateLimitError} If rate limit is exceeded
 * @throws {ExternalServiceError} If npm API is unavailable
 *
 * @example
 * ```typescript
 * const data = await fetchDownloads(
 *   ["react", "vue"],
 *   "1y",
 *   { useCache: true }
 * );
 * console.log(data.react.downloads); // Daily download counts
 * ```
 *
 * @see {@link https://api.npmjs.org/downloads/range/} npm Downloads API
 * @since 1.0.0
 */
export async function fetchDownloads(
  packages: string[],
  period: DownloadPeriod,
  options?: FetchOptions
): Promise<DownloadData> {
  // Implementation...
}
```

### 30.2 README Structure

```markdown
# npm-trend-clone

Compare npm package download trends with interactive charts.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=...)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Features

- 📊 Interactive download trend charts
- 🔍 Package search with autocomplete
- 📱 Responsive design for all devices
- 🌙 Dark mode support
- 🔗 Shareable comparison URLs
- ⭐ Save favorite comparisons

## Quick Start

\`\`\`bash
# Clone repository
git clone https://github.com/laststance/npm-trend-clone.git
cd npm-trend-clone

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Start development server
pnpm dev
\`\`\`

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL (Neon) + Prisma
- **Caching**: Upstash Redis
- **Authentication**: better-auth
- **Deployment**: Vercel

## Documentation

- [Architecture Overview](./docs/architecture.md)
- [API Reference](./docs/api.md)
- [Contributing Guide](./CONTRIBUTING.md)
- [Development Setup](./docs/development.md)

## License

MIT © [Laststance.io](https://github.com/laststance)
```

---

## 31. Deployment Pipeline (Iteration 24)

### 31.1 Vercel Configuration

```json
// vercel.json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "regions": ["iad1", "sfo1", "hnd1"],
  "crons": [
    {
      "path": "/api/cron/warm-cache",
      "schedule": "0 * * * *"
    },
    {
      "path": "/api/cron/cleanup-stale-data",
      "schedule": "0 0 * * *"
    }
  ],
  "headers": [
    {
      "source": "/api/:path*",
      "headers": [
        { "key": "Cache-Control", "value": "s-maxage=60, stale-while-revalidate" }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/compare/:packages*",
      "destination": "/?packages=:packages*"
    }
  ],
  "env": {
    "NEXT_PUBLIC_APP_VERSION": "@npm-trend-clone.NEXT_PUBLIC_APP_VERSION"
  }
}
```

### 31.2 GitHub Actions CI/CD

```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm test:ci
      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm exec playwright install --with-deps
      - run: pnpm build
      - run: pnpm e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/

  deploy-preview:
    if: github.event_name == 'pull_request'
    needs: [lint, test, e2e]
    runs-on: ubuntu-latest
    environment:
      name: preview
      url: ${{ steps.deploy.outputs.url }}
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - name: Deploy to Vercel
        id: deploy
        run: |
          pnpm vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}
          pnpm vercel build --token=${{ secrets.VERCEL_TOKEN }}
          url=$(pnpm vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }})
          echo "url=$url" >> $GITHUB_OUTPUT

  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: [lint, test, e2e]
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://npm-trend-clone.vercel.app
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - name: Deploy to Vercel
        run: |
          pnpm vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
          pnpm vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
          pnpm vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## 32. Legal & Compliance (Iteration 25)

### 32.1 Terms of Service Key Points

- Service provided "as is" without warranties
- User responsible for complying with npm's terms
- Data from npm API subject to npm's policies
- Rate limiting and fair use policies apply
- Account termination rights reserved

### 32.2 Privacy Policy Requirements

- Data collected: email (optional), usage analytics
- Cookies: session, preferences, analytics
- Data retention: 30 days for analytics, indefinite for accounts
- Third-party services: Vercel, npm API
- User rights: access, deletion, export
- GDPR/CCPA compliance considerations

### 32.3 Cookie Consent Implementation

```typescript
// components/legal/CookieConsent.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem("cookie-consent", JSON.stringify({
      necessary: true,
      analytics: true,
      preferences: true,
      timestamp: Date.now(),
    }));
    setShowBanner(false);
  };

  const acceptNecessary = () => {
    localStorage.setItem("cookie-consent", JSON.stringify({
      necessary: true,
      analytics: false,
      preferences: false,
      timestamp: Date.now(),
    }));
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <Card className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50">
      <CardContent className="pt-4">
        <p className="text-sm text-muted-foreground">
          We use cookies to enhance your experience. By continuing to visit this
          site you agree to our use of cookies.{" "}
          <a href="/privacy" className="underline">
            Learn more
          </a>
        </p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" size="sm" onClick={acceptNecessary}>
          Essential only
        </Button>
        <Button size="sm" onClick={acceptAll}>
          Accept all
        </Button>
      </CardFooter>
    </Card>
  );
}
```

---

## 33. SEO Optimization (Iteration 26)

### 33.1 Metadata Configuration

```typescript
// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://npm-trend-clone.vercel.app"),
  title: {
    default: "NPM Trends - Compare npm Package Downloads",
    template: "%s | NPM Trends",
  },
  description:
    "Compare npm package download counts over time. Visualize trends and make informed decisions about JavaScript libraries.",
  keywords: [
    "npm",
    "package",
    "compare",
    "downloads",
    "trends",
    "javascript",
    "node.js",
    "statistics",
  ],
  authors: [{ name: "Laststance.io", url: "https://github.com/laststance" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://npm-trend-clone.vercel.app",
    siteName: "NPM Trends",
    title: "NPM Trends - Compare npm Package Downloads",
    description:
      "Compare npm package download counts over time. Visualize trends and make informed decisions.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NPM Trends - Package Comparison",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NPM Trends - Compare npm Package Downloads",
    description: "Compare npm package download counts over time.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};
```

### 33.2 Dynamic OG Image Generation

```typescript
// app/api/og/route.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const packages = searchParams.get("packages")?.split(",") || [];

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000",
          color: "#fff",
        }}
      >
        <div style={{ fontSize: 60, fontWeight: "bold", marginBottom: 20 }}>
          NPM Trends
        </div>
        <div style={{ fontSize: 30, opacity: 0.8 }}>
          {packages.length > 0
            ? `Comparing: ${packages.join(" vs ")}`
            : "Compare npm Package Downloads"}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
```

### 33.3 Structured Data

```typescript
// app/page.tsx
import { WebSite, WithContext } from "schema-dml";

const structuredData: WithContext<WebSite> = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "NPM Trends",
  url: "https://npm-trend-clone.vercel.app",
  description: "Compare npm package download counts over time",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate:
        "https://npm-trend-clone.vercel.app/?packages={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Page content */}
    </>
  );
}
```

---

## 34. Final Review Checklist (Iteration 27)

### 34.1 Pre-Launch Verification

| Category | Item | Status |
|----------|------|--------|
| **Security** | Security headers configured | ⬜ |
| | Input validation on all endpoints | ⬜ |
| | CSRF protection active | ⬜ |
| | Rate limiting implemented | ⬜ |
| | Secrets in environment variables | ⬜ |
| **Performance** | Core Web Vitals passing | ⬜ |
| | Bundle size < 150KB | ⬜ |
| | Image optimization enabled | ⬜ |
| | Caching configured | ⬜ |
| | Lazy loading implemented | ⬜ |
| **Accessibility** | WCAG 2.1 AA compliant | ⬜ |
| | Keyboard navigation working | ⬜ |
| | Screen reader tested | ⬜ |
| | Color contrast verified | ⬜ |
| **SEO** | Meta tags configured | ⬜ |
| | OG images generated | ⬜ |
| | Sitemap available | ⬜ |
| | robots.txt configured | ⬜ |
| **Legal** | Privacy policy published | ⬜ |
| | Terms of service published | ⬜ |
| | Cookie consent implemented | ⬜ |
| **Monitoring** | Error tracking active | ⬜ |
| | Performance monitoring | ⬜ |
| | Analytics configured | ⬜ |
| | Health checks passing | ⬜ |
| **Testing** | Unit tests passing | ⬜ |
| | Integration tests passing | ⬜ |
| | E2E tests passing | ⬜ |
| | Coverage > 80% | ⬜ |
| **Documentation** | README complete | ⬜ |
| | API docs available | ⬜ |
| | Deployment guide ready | ⬜ |

### 34.2 Post-Launch Monitoring

```typescript
// lib/monitoring/launch-metrics.ts
export const launchMetrics = {
  // Critical metrics to monitor after launch
  targets: {
    errorRate: { max: 0.01 }, // < 1% error rate
    p95Latency: { max: 500 }, // < 500ms
    uptime: { min: 99.9 }, // > 99.9%
    coreWebVitals: {
      LCP: { max: 2500 },
      FID: { max: 100 },
      CLS: { max: 0.1 },
    },
  },

  // Alert thresholds
  alerts: {
    errorSpike: { threshold: 0.05, duration: "5m" },
    latencySpike: { threshold: 1000, duration: "5m" },
    downtime: { threshold: 1, duration: "1m" },
  },
};
```

---

> **PRD Complete**: All 27 iterations documented. Ready for feature_list.json generation and implementation phase.
