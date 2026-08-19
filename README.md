# Debt Manager Client

Modern glassmorphism-themed debt management dashboard built with Next.js 16, TanStack Query, Framer Motion, and TailwindCSS.

## Tech Stack

- **Framework:** Next.js 16 (App Router + Turbopack)
- **UI:** React 19, TailwindCSS 4, DaisyUI 5
- **Animations:** Framer Motion
- **State:** TanStack React Query (server state), React Context (auth)
- **HTTP:** Axios with interceptors + automatic token refresh
- **Toast:** React Toastify
- **Icons:** Lucide React
- **Language:** TypeScript

## Features

- Glass dark theme with backdrop-blur glassmorphism
- Framer Motion animations (page transitions, stagger, hover, modal)
- Colorful gradient bar charts with animated bars
- Role-based navigation (Admin section hidden for non-admins)
- Protected routes with auth guard
- Automatic token refresh with request queue
- Cookie-based auth (no localStorage)
- Responsive design (mobile + desktop)
- Toast notifications for all actions

## Project Structure

```
├── app/
│   ├── layout.tsx                 # Root layout (QueryProvider, AuthProvider, ToastProvider)
│   ├── globals.css                # TailwindCSS + glass theme + toast overrides
│   ├── (auth)/
│   │   ├── layout.tsx             # Centered glass card layout
│   │   ├── login/page.tsx         # Login form
│   │   └── register/page.tsx      # Register form
│   └── (dashboard)/
│       ├── layout.tsx             # App shell (Navbar + Sidebar drawer)
│       ├── home/page.tsx          # Overview with analytics + loan grid
│       ├── dashboard/page.tsx     # Dashboard with stats + charts
│       ├── loans/
│       │   ├── page.tsx           # Loan list with filters + pagination
│       │   ├── new/page.tsx       # Create loan form
│       │   └── [id]/page.tsx      # Loan detail
│       ├── pay/page.tsx           # Pay loan form
│       └── transactions/page.tsx  # Transaction history
├── components/
│   ├── shared/
│   │   ├── Navbar.tsx             # Top navigation bar
│   │   ├── Sidebar.tsx            # Side navigation
│   │   └── ProtectedRoute.tsx     # Auth + role guard
│   └── ui/
│       ├── BarChart.tsx           # Gradient bar charts
│       ├── EmptyState.tsx         # Empty state component
│       ├── LoanCard.tsx           # Loan card with progress
│       ├── Pagination.tsx         # Page navigation
│       ├── PayLoanModal.tsx       # Payment modal
│       ├── StatCard.tsx           # Stat card with glow
│       └── StatusBadge.tsx        # Status + type badges
├── features/
│   ├── loans/
│   │   ├── types.ts               # LoanQueryParams, payloads
│   │   ├── hooks.ts               # useLoans, useLoan, useLoanSummary, mutations
│   │   └── components/
│   │       └── LoanDetailView.tsx # Full loan detail view
│   └── transactions/
│       ├── types.ts               # TransactionQueryParams, payloads
│       └── hooks.ts               # useTransactions, useTransactionStats, mutations
├── lib/
│   ├── api.ts                     # Axios instance + interceptors + apiClient
│   ├── constants.ts               # Labels, options, currency
│   ├── motion.ts                  # Framer Motion variants
│   └── utils.ts                   # formatCurrency, formatDate, cn, etc.
├── providers/
│   ├── auth-provider.tsx          # Auth context (login, register, logout)
│   ├── query-provider.tsx         # TanStack Query provider
│   └── toast-provider.tsx         # React Toastify container
├── types/
│   ├── prisma.ts                  # Raw Prisma model types
│   └── index.ts                   # Extended API types (Loan, Transaction, etc.)
└── proxy.ts                       # Next.js 16 proxy (replaces middleware.ts)
```

## Getting Started

### Prerequisites

- Node.js >= 18
- Backend server running (see [debt-manager-server](../backend))

### Install

```bash
npm install
```

### Environment

Create `.env.local` in the root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1
```

### Run

```bash
npm run dev
```

App starts at `http://localhost:3000`.

### Build

```bash
npm run build
npm start
```

## Pages

| Route | Description |
|-------|-------------|
| `/login` | Login with email + password |
| `/register` | Create new account |
| `/home` | Overview — loan analytics, critical/new/finished loans, all loans grid |
| `/dashboard` | Dashboard — stat cards, bar charts, emergency section, quick clear |
| `/loans` | Loan list with type tabs, search, status/type/sort filters |
| `/loans/new` | Create new loan |
| `/loans/:id` | Loan detail — stats, progress bar, edit, delete, transactions |
| `/pay` | Select loan and record payment |
| `/transactions` | Transaction history with stats cards, search, type filter |

## Demo Credentials

```
Email:    admin@demo.com
Password: Amin1234
```

## Architecture Decisions

- **Cookie-based auth** — httpOnly cookies for access + refresh tokens. No localStorage. Cross-port cookies via `domain: localhost` in development.
- **No SSR data fetching** — All data fetched client-side with TanStack Query for real-time updates.
- **Next.js 16 proxy** — `proxy.ts` replaces `middleware.ts` (renamed in Next.js 16).
- **Feature-based structure** — Each feature (`loans`, `transactions`) owns its types, hooks, and related components.
- **Separate Prisma types** — `types/prisma.ts` mirrors DB models; `types/index.ts` extends them with API-specific fields.

## License

MIT
