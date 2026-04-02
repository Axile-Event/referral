🔹 Frontend Structure (Next.js App Router)
📁 Root
app/
 ├── (auth)/
 ├── (dashboard)/
 ├── (public)/
 ├── api/ (only if needed)
 ├── components/
 ├── lib/
 ├── hooks/
 ├── store/
 └── types/
🔹 Route Groups
🔐 (auth)
(auth)/
 ├── login/page.tsx
 ├── signup/page.tsx
🌍 (public)
(public)/
 ├── events/page.tsx
 ├── event/[id]/page.tsx
 ├── ref/[code]/event/[id]/page.tsx   ← referral entry

👉 This route:

calls backend /ref/{code}/event/{id}

sets cookie

redirects

📊 (dashboard)
(dashboard)/
 ├── layout.tsx
 ├── page.tsx

 ├── referrals/
 │    ├── page.tsx
 │    └── components/

 ├── wallet/
 │    ├── page.tsx
 │    └── components/

 ├── events/
 │    ├── create/page.tsx
 │    └── components/
🔹 Key Pages Breakdown
1. Event Creation
events/create/page.tsx
Components:

ReferralToggle.tsx

RewardTypeSelect.tsx

RewardValueInput.tsx

TooltipInfo.tsx

2. Referral Dashboard
referrals/page.tsx
Show:

Total Earnings

Pending Earnings

Withdrawable Balance

Referral list

Components:

ReferralStats.tsx

ReferralTable.tsx

ReferralLinkCard.tsx

3. Wallet
wallet/page.tsx
Components:

BalanceCard.tsx

WithdrawButton.tsx

TransactionList.tsx

4. Event Page (CRITICAL)
(public)/event/[id]/page.tsx

On load:

check cookie → ref_code

attach to purchase request

🔹 Global Components
components/
 ├── ui/ (shadcn stuff)
 ├── referral/
 │    ├── CopyLink.tsx
 │    ├── StatusBadge.tsx
 │    └── RewardBadge.tsx
 ├── wallet/
 └── layout/
🔹 State Management

Keep it simple. Don’t over-engineer.

Use:

React Query (TanStack) → server state

Zustand → small client state

Example Store
// store/referral.ts
import { create } from "zustand";

export const useReferralStore = create((set) => ({
  refCode: null,
  setRefCode: (code) => set({ refCode: code }),
}));
🔹 API Layer
lib/api/
 ├── auth.ts
 ├── events.ts
 ├── referrals.ts
 ├── wallet.ts
Example
// lib/api/referrals.ts
export const getReferrals = async () => {
  return fetch("/api/referrals").then(res => res.json());
};
🔹 Hooks
hooks/
 ├── useAuth.ts
 ├── useReferrals.ts
 ├── useWallet.ts
🔹 Types
types/
 ├── user.ts
 ├── event.ts
 ├── referral.ts
 ├── wallet.ts
🔹 Critical Logic (Don’t Miss This)
Referral Capture
// in /ref/[code]/event/[id]
useEffect(() => {
  document.cookie = `ref_code=${code}; path=/; max-age=604800`;
  router.push(`/event/${id}`);
}, []);
Attach on Purchase
const refCode = getCookie("ref_code");

await purchaseTicket({
  eventId,
  refCode,
});