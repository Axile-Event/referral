

## **Comprehensive Setup Prompt for Axile Referral System Frontend Repository**

### **OVERVIEW**
You are setting up a new Next.js 16 frontend repository (`referral.axile.ng`) for a referral system within the Axile Event platform. This repo must maintain visual and architectural consistency with the existing `Axile-Event/Frontend` repository.

---

### **PART 1: ARCHITECTURE GUIDELINES FROM MAIN REPO**

The Axile Frontend uses the following structure and technologies:

**Tech Stack:**
- **Framework**: Next.js 16.0.7 (App Router)
- **Styling**: Tailwind CSS v4 with PostCSS
- **UI Components**: Radix UI (primitives), shadcn/ui pattern (headless components)
- **State Management**: Zustand 5.0.9
- **Data Fetching**: Axios, @tanstack/react-query
- **Form Handling**: React Hook Form
- **Notifications**: react-hot-toast
- **Date Picking**: react-datepicker
- **QR Codes**: qrcode.react, html5-qrcode
- **Animations**: Framer Motion
- **Icons**: lucide-react
- **Fonts**: Plus Jakarta Sans (--font-plus-jakarta-sans), Geist Mono (--font-geist-mono)

**Folder Structure:**
```
src/
├── app/              # Next.js App Router pages
│   ├── (auth)/       # Public auth routes (login, signup)
│   ├── (protected)/  # Protected routes (requires authentication)
│   ├── api/          # API route handlers
│   └── [other routes]/
├── components/       # Reusable components (organized by feature)
├── hooks/            # Custom React hooks
├── lib/              # Utility functions, helpers
├── store/            # Zustand store definitions
└── data/             # Static data, constants
```

**Brand Colors (from globals.css):**
- **Primary**: `#e11d48` (Rose/Crimson Red) - used for buttons, highlights, rings
- **Primary Foreground**: `#ffffff` (White text on primary)
- **Secondary**: `#f4f4f5` (Light Gray)
- **Background (Light)**: `#ffffff`
- **Background (Dark)**: `#0a0a14` (Dark Navy)
- **Card (Dark)**: `#12121f`
- **Foreground**: `#09090b` (Light mode), `#ffffff` (Dark mode)
- **Accent**: `#f4f4f5`
- **Border**: `#e4e4e7` (Light), `#27272a` (Dark)
- **Ring**: `#e11d48` (Same as primary for focus states)

**Styling Patterns:**
- Tailwind CSS utility-first approach
- Component-level scoped styling via shadcn/ui pattern (no separate CSS files for components)
- CSS custom properties (CSS variables) in globals.css for theming
- Dark mode support via `.dark` class selector
- Radius default: `0.5rem`

---

### **PART 2: REPOSITORY STRUCTURE FOR REFERRAL SYSTEM**

Create the following folder and file structure:

```
referral.axile.ng/
├── .gitignore
├── .env.example
├── package.json
├── next.config.mjs
├── tailwind.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── jsconfig.json
├── README.md
│
├── public/
│   └── .gitkeep
│
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with providers
│   │   ├── page.tsx                # Landing/home page
│   │   ├── globals.css             # Global styles (copy Axile brand colors)
│   │   │
│   │   ├── (auth)/
│   │   │   ├── layout.tsx          # Auth layout (no navbar/footer)
│   │   │   ├── signup/
│   │   │   │   └── page.tsx        # User signup page
│   │   │   └── login/
│   │   │       └── page.tsx        # User login page
│   │   │
│   │   ├── (protected)/
│   │   │   ├── layout.tsx          # Protected layout with navbar
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx        # Main dashboard
│   │   │   │   ├── referrals/
│   │   │   │   │   └── page.tsx    # Referrals list & manage
│   │   │   │   └── wallet/
│   │   │   │       └── page.tsx    # Wallet/earnings
│   │   │   │
│   │   │   ├── events/
│   │   │   │   └── referral-enabled/
│   │   │   │       └── page.tsx    # Events with referrals enabled
│   │   │   │
│   │   │   └── event/
│   │   │       └── [id]/
│   │   │           └── page.tsx    # Single event details
│   │   │
│   │   └── api/
│   │       └── [[...route]]/
│   │           └── route.ts        # API placeholder
│   │
│   ├── components/
│   │   ├── ui/                     # Base UI components (Radix + shadcn pattern)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── card.tsx
│   │   │   ├── select.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── toast.tsx
│   │   │   └── .gitkeep
│   │   │
│   │   ├── layout/
│   │   │   ├── navbar.tsx          # Navigation bar (protected pages)
│   │   │   ├── sidebar.tsx         # Sidebar (if dashboard has one)
│   │   │   ├── footer.tsx
│   │   │   └── auth-provider.tsx   # Auth context provider
│   │   │
│   │   ├── referral/               # Referral-specific components
│   │   │   ├── referral-card.tsx
│   │   │   ├── referral-link.tsx
│   │   │   ├── referral-modal.tsx
│   │   │   ├── referral-form.tsx
│   │   │   └── .gitkeep
│   │   │
│   │   ├── wallet/                 # Wallet/earnings components
│   │   │   ├── wallet-card.tsx
│   │   │   ├── earnings-chart.tsx
│   │   │   ├── transaction-list.tsx
│   │   │   └── .gitkeep
│   │   │
│   │   ├── event/                  # Event-related components
│   │   │   ├── event-card.tsx
│   │   │   ├── event-list.tsx
│   │   │   ├── event-detail.tsx
│   │   │   └── .gitkeep
│   │   │
│   │   └── common/                 # Shared UI components
│   │       ├── loading.tsx
│   │       ├── empty-state.tsx
│   │       ├── error-boundary.tsx
│   │       └── .gitkeep
│   │
│   ├── lib/
│   │   ├── api/                    # API client & endpoints
│   │   │   ├── client.ts           # Axios instance (base URL, interceptors)
│   │   │   ├── referral.ts         # Referral API methods
│   │   │   ├── auth.ts             # Auth API methods
│   │   │   ├── event.ts            # Event API methods
│   │   │   ├── wallet.ts           # Wallet API methods
│   │   │   └── .gitkeep
│   │   │
│   │   ├── utils/
│   │   │   ├── cn.ts               # classNames utility
│   │   │   ├── format.ts           # Formatting utilities
│   │   │   ├── validate.ts         # Validation helpers
│   │   │   └── .gitkeep
│   │   │
│   │   └── hooks/
│   │       ├── useAuth.ts          # Auth hook
│   │       ├── useReferral.ts      # Referral hook
│   │       ├── useWallet.ts        # Wallet hook
│   │       └── .gitkeep
│   │
│   ├── store/
│   │   ├── authStore.ts            # Auth state (Zustand)
│   │   ├── referralStore.ts        # Referral tracking state
│   │   ├── walletStore.ts          # Wallet state
│   │   └── .gitkeep
│   │
│   └── types/
│       ├── auth.ts                 # Auth types
│       ├── referral.ts             # Referral types
│       ├── event.ts                # Event types
│       ├── wallet.ts               # Wallet types
│       ├── api.ts                  # API response types
│       └── .gitkeep
```

---

### **PART 3: KEY FILES TO CREATE**

#### **1. `package.json`**
```json
{
  "name": "referral-axile",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-label": "^2.1.8",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-separator": "^1.1.8",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-switch": "^1.2.6",
    "@react-oauth/google": "^0.12.2",
    "@tanstack/react-query": "^5.90.21",
    "@tanstack/react-table": "^8.20.5",
    "@vercel/analytics": "^1.6.1",
    "@vercel/speed-insights": "^1.3.1",
    "axios": "^1.7.9",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "framer-motion": "^12.23.25",
    "lucide-react": "^0.555.0",
    "next": "16.0.7",
    "next-themes": "^0.4.6",
    "qrcode.react": "^4.2.0",
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "react-hook-form": "^7.70.0",
    "react-hot-toast": "^2.6.0",
    "tailwind-merge": "^3.4.0",
    "zustand": "^5.0.9"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "25.0.8",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "babel-plugin-react-compiler": "1.0.0",
    "eslint": "^9",
    "eslint-config-next": "16.0.7",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

#### **2. `tailwind.config.ts`**
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        popover: "var(--popover)",
        "popover-foreground": "var(--popover-foreground)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        destructive: "var(--destructive)",
        "destructive-foreground": "var(--destructive-foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
      },
      borderRadius: {
        lg: "0.5rem",
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
    },
  },
  plugins: [],
};
export default config;
```

#### **3. `src/app/globals.css`** (Copy brand colors from main repo)
Include the exact CSS from Axile-Event/Frontend with primary color `#e11d48`, dark mode support, and all custom properties.

#### **4. `src/app/layout.tsx`**
```typescript
/**
 * Root Layout Component
 * Sets up:
 * - Global fonts (Plus Jakarta Sans, Geist Mono)
 * - Theme providers (next-themes)
 * - Verification/Analytics
 * - Meta tags
 */

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Axile Referral System",
  description: "Earn money by referring events to your network",
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        {/* Theme Provider wrapper */}
        {/* Analytics/Verification providers */}
        {children}
      </body>
    </html>
  );
}
```

#### **5. `src/app/page.tsx`** (Landing Page)
```typescript
/**
 * Landing/Home Page
 * Displays:
 * - Hero section with referral value proposition
 * - How referrals work
 * - CTA buttons (Sign Up, Login)
 * - Feature highlights
 */

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* TODO: Landing page content */}
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-4xl font-bold text-primary">
          Axile Referral System
        </h1>
      </div>
    </main>
  );
}
```

---

### **PART 4: PLACEHOLDER PAGES**

Create empty/stub pages with TypeScript and JSDoc comments indicating intended functionality:

#### **Auth Pages** (`(auth)/signup/page.tsx`, `(auth)/login/page.tsx`)
```typescript
/**
 * Sign Up Page
 * 
 * Features:
 * - Email/password registration form
 * - Social login (Google OAuth)
 * - Form validation with react-hook-form
 * - Toast notifications (react-hot-toast)
 * - Link to login page
 * 
 * Components Used:
 * - Button (shadcn/ui)
 * - Input (shadcn/ui)
 * - Card (shadcn/ui)
 * - useForm hook (react-hook-form)
 * 
 * Brand Colors:
 * - Primary button: #e11d48
 * - Input border: #e4e4e7
 */

export default function SignUp() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      {/* TODO: SignUp form with email, password, google auth */}
    </div>
  );
}
```

#### **Protected Pages** (Dashboard, Referrals, Wallet)
```typescript
/**
 * Dashboard Page
 * 
 * Features:
 * - User profile summary
 * - Total referrals count
 * - Earnings overview
 * - Quick actions (Create Referral Link, View Events)
 * - Recent referrals list
 * 
 * State Management:
 * - useAuthStore (check user is logged in)
 * - useReferralStore (fetch user referrals)
 * - useWalletStore (fetch earnings)
 * 
 * Components:
 * - Navbar (top navigation)
 * - DashboardCard
 * - StatCard
 * - RecentReferralsList
 */

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* TODO: Dashboard layout with cards and widgets */}
    </div>
  );
}
```

#### **Event Pages**
```typescript
/**
 * Events with Referral Enabled Page
 * 
 * Features:
 * - List of events that have referral rewards enabled
 * - Filter by category, date, earnings potential
 * - Event cards with referral details
 * - CTA: "Generate Referral Link"
 * 
 * Components:
 * - EventCard (shows event name, date, referral reward)
 * - EventFilter
 * - EventList
 * 
 * Data Fetching:
 * - TanStack Query (react-query) to fetch events
 */

export default function ReferralEnabledEvents() {
  return (
    <div className="min-h-screen bg-background">
      {/* TODO: List of referral-enabled events */}
    </div>
  );
}
```

```typescript
/**
 * Single Event Details Page [id]
 * 
 * Features:
 * - Event information (name, description, date, location)
 * - Referral details (commission, how to earn)
 * - Referral link generator
 * - QR code generator (qrcode.react)
 * - Share buttons (copy link, social)
 * 
 * Dynamic Route:
 * - /event/[id]
 * - Fetch event by ID
 */

export default function EventDetail({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      {/* TODO: Event details with referral link generator */}
    </div>
  );
}
```

```typescript
/**
 * Referral Landing Page [code]/event/[id]
 * 
 * Features:
 * - Shows when someone clicks a referral link
 * - Event info with referral context
 * - "Sign Up & Attend" CTA
 * - Tracks referrer via URL code parameter
 * 
 * Dynamic Route:
 * - /ref/[code]/event/[id]
 * - Validate referral code
 * - Pre-fill referrer on signup
 */

export default function ReferralEventPage({
  params,
}: {
  params: { code: string; id: string };
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* TODO: Event landing page with referral context */}
    </div>
  );
}
```

---

### **PART 5: COMPONENT STUBS**

#### **UI Components** (`src/components/ui/`)
Create empty stubs with proper TypeScript interfaces:

**Button.tsx:**
```typescript
/**
 * Button Component
 * 
 * Props:
 * - variant: "default" | "primary" | "secondary" | "ghost" | "destructive"
 * - size: "sm" | "md" | "lg"
 * - disabled: boolean
 * - loading: boolean
 * 
 * Colors:
 * - Default: #e11d48 (primary red)
 * - Hover: Darker shade
 * - Disabled: #e4e4e7 (gray)
 */

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "default" | "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Button({
  children,
  variant = "default",
  size = "md",
  ...props
}: ButtonProps) {
  // TODO: Implement button with variant styles
  return <button className="btn">{children}</button>;
}
```

**Similar stubs for:** Input.tsx, Label.tsx, Card.tsx, Select.tsx, Dialog.tsx, DropdownMenu.tsx, Toast.tsx

#### **Layout Components** (`src/components/layout/`)

**Navbar.tsx:**
```typescript
/**
 * Navigation Bar Component
 * 
 * Features:
 * - Logo/brand
 * - Navigation links (Dashboard, Referrals, Wallet, Events)
 * - User menu dropdown
 * - Dark mode toggle
 * 
 * Colors:
 * - Background: #ffffff (light) / #12121f (dark)
 * - Border: #e4e4e7 (light) / #27272a (dark)
 */

export function Navbar() {
  // TODO: Implement navbar with navigation links
  return <nav className="border-b border-border">{/* TODO */}</nav>;
}
```

**Sidebar.tsx:**
```typescript
/**
 * Sidebar Component
 * 
 * Features:
 * - Menu items with icons (lucide-react)
 * - Active state highlight
 * - Collapsible on mobile
 */

export function Sidebar() {
  // TODO: Implement sidebar
  return <aside className="w-64 bg-card">{/* TODO */}</aside>;
}
```

**Footer.tsx:**
```typescript
/**
 * Footer Component
 * 
 * Features:
 * - Links (Terms, Privacy, Contact)
 * - Copyright
 * - Social links
 */

export function Footer() {
  // TODO: Implement footer
  return <footer className="border-t border-border">{/* TODO */}</footer>;
}
```

**AuthProvider.tsx:**
```typescript
/**
 * Auth Context Provider
 * 
 * Provides:
 * - Current user state
 * - Login/logout methods
 * - Auth token management
 * 
 * Uses:
 * - Zustand (useAuthStore)
 * - React Context (for provider pattern)
 */

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // TODO: Implement auth provider wrapper
  return children;
}
```

#### **Feature Components** (`src/components/referral/`, `src/components/wallet/`, `src/components/event/`)

**ReferralCard.tsx:**
```typescript
/**
 * Referral Card Component
 * 
 * Displays:
 * - Referrer name
 * - Event name
 * - Commission amount
 * - Status (Pending, Completed, Failed)
 * - Date
 * 
 * Brand Colors:
 * - Status badge: Primary #e11d48
 * - Border: #e4e4e7
 */

interface ReferralCardProps {
  referralId: string;
  referrerName: string;
  eventName: string;
  commission: number;
  status: "pending" | "completed" | "failed";
  date: string;
}

export function ReferralCard(props: ReferralCardProps) {
  // TODO: Implement referral card UI
  return <div className="bg-card border border-border rounded-lg">{/* TODO */}</div>;
}
```

**ReferralLink.tsx:**
```typescript
/**
 * Referral Link Component
 * 
 * Features:
 * - Display referral link
 * - Copy to clipboard button
 * - QR code preview
 * - Share buttons (Twitter, WhatsApp, Email)
 */

export function ReferralLink({ refLink }: { refLink: string }) {
  // TODO: Implement link display with copy/share
  return <div>{/* TODO */}</div>;
}
```

**WalletCard.tsx:**
```typescript
/**
 * Wallet Card Component
 * 
 * Displays:
 * - Available balance
 * - Pending earnings
 * - Total earned
 * - Withdrawal button
 * 
 * Colors:
 * - Primary: #e11d48
 */

interface WalletCardProps {
  balance: number;
  pending: number;
  total: number;
}

export function WalletCard(props: WalletCardProps) {
  // TODO: Implement wallet display
  return <div className="bg-gradient-to-r from-primary to-red-600">{/* TODO */}</div>;
}
```

**EventCard.tsx:**
```typescript
/**
 * Event Card Component
 * 
 * Displays:
 * - Event image
 * - Event name
 * - Date/time
 * - Referral reward amount
 * - View/Share CTA buttons
 */

interface EventCardProps {
  eventId: string;
  name: string;
  date: string;
  reward: number;
  image?: string;
}

export function EventCard(props: EventCardProps) {
  // TODO: Implement event card
  return <div className="bg-card border border-border rounded-lg">{/* TODO */}</div>;
}
```

---

### **PART 6: STATE MANAGEMENT (Zustand Stores)**

#### **`src/store/authStore.ts`**
```typescript
/**
 * Auth Store
 * 
 * State:
 * - user: User | null
 * - isAuthenticated: boolean
 * - isLoading: boolean
 * - error: string | null
 * 
 * Actions:
 * - login(email, password)
 * - signup(email, password, name)
 * - logout()
 * - refreshToken()
 * - setUser(user)
 */

import { create } from "zustand";

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  // TODO: Implement actions
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  setUser: (user) => set({ user, isAuthenticated: !!user }),
}));
```

#### **`src/store/referralStore.ts`**
```typescript
/**
 * Referral Store
 * 
 * State:
 * - referrals: Referral[]
 * - myReferralCode: string
 * - totalEarnings: number
 * - isLoading: boolean
 * 
 * Actions:
 * - fetchUserReferrals()
 * - generateReferralLink(eventId)
 * - trackReferralClick(code, eventId)
 * - fetchReferralStats()
 */

import { create } from "zustand";

interface Referral {
  id: string;
  code: string;
  eventId: string;
  eventName: string;
  earnings: number;
  conversions: number;
  status: "active" | "inactive";
  createdAt: string;
}

interface ReferralStore {
  referrals: Referral[];
  myReferralCode: string | null;
  totalEarnings: number;
  isLoading: boolean;
  
  // Actions
  fetchUserReferrals: () => Promise<void>;
  generateReferralLink: (eventId: string) => Promise<string>;
  trackReferralClick: (code: string, eventId: string) => Promise<void>;
}

export const useReferralStore = create<ReferralStore>((set) => ({
  referrals: [],
  myReferralCode: null,
  totalEarnings: 0,
  isLoading: false,
  
  // TODO: Implement actions
  fetchUserReferrals: async () => {},
  generateReferralLink: async () => "",
  trackReferralClick: async () => {},
}));
```

#### **`src/store/walletStore.ts`**
```typescript
/**
 * Wallet Store
 * 
 * State:
 * - balance: number
 * - pending: number
 * - totalEarned: number
 * - transactions: Transaction[]
 * - isLoading: boolean
 * 
 * Actions:
 * - fetchWalletData()
 * - requestWithdrawal(amount)
 * - fetchTransactionHistory()
 */

import { create } from "zustand";

interface Transaction {
  id: string;
  type: "referral" | "withdrawal" | "refund";
  amount: number;
  status: "completed" | "pending" | "failed";
  date: string;
  description: string;
}

interface WalletStore {
  balance: number;
  pending: number;
  totalEarned: number;
  transactions: Transaction[];
  isLoading: boolean;
  
  // Actions
  fetchWalletData: () => Promise<void>;
  requestWithdrawal: (amount: number) => Promise<void>;
  fetchTransactionHistory: () => Promise<void>;
}

export const useWalletStore = create<WalletStore>((set) => ({
  balance: 0,
  pending: 0,
  totalEarned: 0,
  transactions: [],
  isLoading: false,
  
  // TODO: Implement actions
  fetchWalletData: async () => {},
  requestWithdrawal: async () => {},
  fetchTransactionHistory: async () => {},
}));
```

---

### **PART 7: API CLIENT & ENDPOINTS**

#### **`src/lib/api/client.ts`**
```typescript
/**
 * Axios API Client Setup
 * 
 * Configuration:
 * - Base URL: ${process.env.NEXT_PUBLIC_API_URL}
 * - Timeout: 10 seconds
 * - Headers: Content-Type: application/json, Authorization bearer token
 * 
 * Interceptors:
 * - Request: Attach auth token
 * - Response: Handle 401 (logout), 500 (error toast)
 */

import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.axile.ng",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// TODO: Add request/response interceptors for auth, error handling

export default apiClient;
```

#### **`src/lib/api/referral.ts`**
```typescript
/**
 * Referral API Methods
 * 
 * Endpoints:
 * - GET /referrals - Get user's referrals
 * - POST /referrals/generate - Generate new referral link
 * - POST /referrals/track - Track referral click
 * - GET /referrals/stats - Get referral statistics
 * - POST /referrals/[id]/disable - Disable referral link
 */

import apiClient from "./client";

export const referralApi = {
  getUserReferrals: async () => {
    // TODO: GET /referrals
  },
  
  generateLink: async (eventId: string) => {
    // TODO: POST /referrals/generate
  },
  
  trackClick: async (code: string, eventId: string) => {
    // TODO: POST /referrals/track
  },
  
  getStats: async () => {
    // TODO: GET /referrals/stats
  },
};
```

#### **`src/lib/api/auth.ts`**
```typescript
/**
 * Auth API Methods
 * 
 * Endpoints:
 * - POST /auth/signup - User registration
 * - POST /auth/login - User login
 * - POST /auth/logout - User logout
 * - POST /auth/refresh - Refresh auth token
 * - GET /auth/me - Get current user
 */

import apiClient from "./client";

export const authApi = {
  signup: async (email: string, password: string, name: string) => {
    // TODO: POST /auth/signup
  },
  
  login: async (email: string, password: string) => {
    // TODO: POST /auth/login
  },
  
  logout: async () => {
    // TODO: POST /auth/logout
  },
  
  getCurrentUser: async () => {
    // TODO: GET /auth/me
  },
};
```

#### **`src/lib/api/event.ts`**
```typescript
/**
 * Event API Methods
 * 
 * Endpoints:
 * - GET /events - Get all events
 * - GET /events?referralEnabled=true - Get referral-enabled events
 * - GET /events/[id] - Get single event
 * - GET /events/[id]/referral-info - Get event referral details
 */

import apiClient from "./client";

export const eventApi = {
  getEvents: async (filters?: any) => {
    // TODO: GET /events
  },
  
  getReferralEnabledEvents: async () => {
    // TODO: GET /events?referralEnabled=true
  },
  
  getEventById: async (id: string) => {
    // TODO: GET /events/[id]
  },
  
  getEventReferralInfo: async (id: string) => {
    // TODO: GET /events/[id]/referral-info
  },
};
```

#### **`src/lib/api/wallet.ts`**
```typescript
/**
 * Wallet API Methods
 * 
 * Endpoints:
 * - GET /wallet/balance - Get wallet balance
 * - GET /wallet/transactions - Get transaction history
 * - POST /wallet/withdraw - Request withdrawal
 * - GET /wallet/stats - Get earnings stats
 */

import apiClient from "./client";

export const walletApi = {
  getBalance: async () => {
    // TODO: GET /wallet/balance
  },
  
  getTransactions: async () => {
    // TODO: GET /wallet/transactions
  },
  
  requestWithdrawal: async (amount: number) => {
    // TODO: POST /wallet/withdraw
  },
  
  getStats: async () => {
    // TODO: GET /wallet/stats
  },
};
```

---

### **PART 8: TYPES DEFINITIONS**

#### **`src/types/auth.ts`**
```typescript
/**
 * Auth-related TypeScript types
 */

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}
```

#### **`src/types/referral.ts`**
```typescript
/**
 * Referral-related TypeScript types
 */

export interface Referral {
  id: string;
  code: string;
  eventId: string;
  eventName: string;
  referrerId: string;
  earnings: number;
  conversions: number;
  status: "active" | "inactive";
  createdAt: string;
  expiresAt?: string;
}

export interface ReferralLink {
  code: string;
  url: string;
  qrCode?: string;
  expiresAt?: string;
}

export interface ReferralStats {
  totalReferrals: number;
  totalEarnings: number;
  totalConversions: number;
  activeLinks: number;
}
```

#### **`src/types/event.ts`**
```typescript
/**
 * Event-related TypeScript types
 */

export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image?: string;
  category?: string;
  price?: number;
  referralEnabled: boolean;
  referralReward?: number;
}

export interface EventReferralInfo {
  eventId: string;
  eventName: string;
  reward: number;
  description: string;
  validUntil: string;
}
```

#### **`src/types/wallet.ts`**
```typescript
/**
 * Wallet-related TypeScript types
 */

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  pending: number;
  totalEarned: number;
  currency: string;
}

export interface Transaction {
  id: string;
  walletId: string;
  type: "referral" | "withdrawal" | "refund" | "bonus";
  amount: number;
  status: "completed" | "pending" | "failed";
  description: string;
  date: string;
  referenceId?: string;
}

export interface WithdrawalRequest {
  id: string;
  walletId: string;
  amount: number;
  status: "pending" | "approved" | "rejected" | "completed";
  bankDetails?: BankDetails;
  requestedAt: string;
  completedAt?: string;
}

export interface BankDetails {
  accountNumber: string;
  bankCode: string;
  accountName: string;
}
```

#### **`src/types/api.ts`**
```typescript
/**
 * API Response types
 */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
```

---

### **PART 9: UTILITIES & HELPERS**

#### **`src/lib/utils/cn.ts`** (ClassNames utility)
```typescript
/**
 * Merge Tailwind classes without conflicts
 * Uses clsx and tailwind-merge
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

#### **`src/lib/utils/format.ts`** (Formatting utilities)
```typescript
/**
 * Utility functions for formatting values
 */

export function formatCurrency(amount: number, currency = "NGN") {
  // TODO: Format currency with proper locale
  return `${currency} ${amount.toLocaleString()}`;
}

export function formatDate(date: string | Date) {
  // TODO: Format date in readable format
  return new Date(date).toLocaleDateString();
}

export function formatReferralLink(code: string) {
  // TODO: Generate full referral link URL
  return `${process.env.NEXT_PUBLIC_APP_URL}/ref/${code}`;
}
```

#### **`src/lib/utils/validate.ts`** (Validation helpers)
```typescript
/**
 * Validation functions for forms
 */

export function validateEmail(email: string) {
  // TODO: Validate email format
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password: string) {
  // TODO: Validate password strength (min 8 chars, etc)
  return password.length >= 8;
}

export function validateReferralCode(code: string) {
  // TODO: Validate referral code format
  return /^[A-Z0-9]{6,10}$/.test(code);
}
```

---

### **PART 10: ENVIRONMENT SETUP**

#### **`.env.example`**
```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://api.axile.ng
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Google OAuth (if using)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

# Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=
NEXT_PUBLIC_SPEED_INSIGHTS_ID=

# Theme
NEXT_PUBLIC_DEFAULT_THEME=dark
```

---

### **PART 11: CONFIGURATION FILES**

#### **`tsconfig.json`**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noImplicitAny": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

#### **`next.config.mjs`** (with security headers from main repo)
Include security headers, image optimization, and Turbopack config.

#### **`postcss.config.mjs`**
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

---

### **PART 12: SUMMARY OF BRAND CONSISTENCY**

**Colors to Apply Throughout:**
- Primary: `#e11d48` (Rose Red) - All CTAs, buttons, highlights
- Primary Foreground: `#ffffff` - Text on primary
- Secondary: `#f4f4f5` - Backgrounds, subtle elements
- Dark Background: `#0a0a14` - Dark mode base
- Card: `#12121f` - Card backgrounds (dark)
- Border: `#e4e4e7` (light) / `#27272a` (dark)
- Input: `#e4e4e7` (light) / `#27272a` (dark)
- Ring (Focus): `#e11d48` - Focus states

**UI Patterns:**
- Use shadcn/ui component pattern (Radix UI primitives wrapped)
- Tailwind CSS for all styling
- Dark mode support via CSS custom properties
- Border radius: `0.5rem` consistently
- Lucide-react for all icons
- Framer Motion for animations (optional)

**Font Stack:**
- Sans: Plus Jakarta Sans
- Mono: Geist Mono

---

### **FINAL NOTES**

1. **Empty/Stub Pattern**: All component and page files should have JSDoc comments explaining their purpose, props, and any brand color notes.

2. **Git Workflow**: Initialize with `.gitkeep` files in empty directories so folder structure is maintained.

3. **Ready for Development**: Developers can immediately start building features without worrying about architecture or styling conventions.

4. **Type Safety**: Full TypeScript support with comprehensive type definitions for all features.

5. **Scalability**: Store structure, API client pattern, and component organization allow easy feature expansion.

