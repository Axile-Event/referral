# 🎟️ Axile Referral System (referral.axile.ng)

A high-performance referral earning system for Axile, designed to drive event ticket sales through incentivized user sharing. Rewards are tied directly to verified revenue (ticket check-ins).

## 🎯 Project Goal
*   **Drive Sales:** Incentivize users to promote events.
*   **Revenue Protection:** Rewards are only credited upon successful ticket check-in (not just payment).
*   **Organizer Control:** Give event organizers full autonomy over referral incentives (Fixed vs. Percentage).

## 🛠️ Tech Stack
- **Frontend:** Next.js (App Router), TailwindCSS, shadcn/ui.
- **State Management:** React Query (Server State), Zustand (Client State).
- **Backend:** Python (RESTful API).
- **Currency:** All rewards are calculated and paid in Naira (₦).

## ⚙️ Core Features
1.  **Referral-Enabled Events:** Organizers can toggle referrals on/off and define reward models (Fixed Naira or Percentage of ticket price).
2.  **Smart Reward Logic:** Rewards are triggered by ticket check-in to prevent abuse and ensure revenue verification.
3.  **Unified Wallet:** Users track earnings, pending rewards, and withdrawal history.
4.  **Instant Withdrawals:** Minimum threshold of ₦500 for withdrawal requests.
5.  **Referral Tracking:** Automatic cookie-based referral capture and silent attachment during the purchase flow.

## 🔁 Lifecycle Flow
1.  **Share:** Referrer generates and shares a unique event link.
2.  **Click:** Buyer clicks the link and is redirected to the event page; a referral cookie is set.
3.  **Purchase:** Buyer purchases a ticket; the referral code is attached to the transaction.
4.  **Verify:** Ticket is checked-in at the event.
5.  **Reward:** Naira is credited to the Referrer's wallet.
6.  **Withdraw:** Referrer withdraws balance once the threshold is met.

## 📁 Project Structure (Frontend)
```text
app/
 ├── (auth)/         # Login, Signup
 ├── (dashboard)/    # Referrals, Wallet, Event Creation
 ├── (public)/       # Event pages, Referral entry routes
 ├── components/     # shadcn/ui & custom business components
 ├── lib/            # API clients, utils
 ├── hooks/          # useAuth, useReferrals, useWallet
 └── types/          # TypeScript definitions
```

## 🔐 API Endpoints (Highlights)
- `POST /auth/login` - User authentication.
- `GET /events?referral_enabled=true` - Fetch events with rewards.
- `GET /ref/{code}/event/{id}` - Handle referral landing & cookie setting.
- `POST /internal/tickets/checkin` - System hook to credit rewards upon check-in.
- `GET /wallet` - Fetch balance and history.

---

## 🚀 Future Features
- **Axile Points (AP):** Integration of Axile Points system for gamified rewards.
- **Leaderboards:** Monthly referral competitions for additional bonuses.
- **Multi-tier Referrals:** Earn commissions from referees' referrals.

---

*Built for Axile Event.*