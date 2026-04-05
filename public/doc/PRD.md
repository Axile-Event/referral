🔹 PRD — Referral System (referral.axile.ng)
Product

Referral earning system for Axile tied to event ticket sales

🎯 Goal

Increase ticket sales via users

Only reward real revenue

Let event organizers control referral incentives

👤 Actors
1. Referrer (User)

Shares event referral link

Earns Naira after ticket is used (checked-in)

2. Buyer

Purchases ticket via referral link

3. Organizer

Enables referral when creating event

Defines reward model

⚙️ Core Features
1. Referral-enabled Events

Organizer config during event creation:

referral_enabled: boolean

reward_type: fixed | percentage

reward_value: number

Tooltip:

Referral lets users promote your event and earn when tickets are successfully used

2. Reward Logic

Trigger: ticket check-in

Not at payment → prevents abuse

Calculation:

Fixed:

e.g. ₦100 per ticket

Percentage:

e.g. 30% of ticket price

3. Referral Flow

Referrer gets:

referral.axile.ng/ref/{code}/event/{eventId}

Buyer clicks → redirected to event page

Referral stored (cookie/session)

Buyer purchases ticket

Ticket checked-in → reward credited

4. Wallet

balance

5. Withdrawal

Min: ₦500

Status:

pending

approved

paid

🔁 Lifecycle

Referral link clicked

Ticket purchased

Ticket checked-in

Naira credited

User withdraws

🔹 FRONTEND TASKS (will be assigned to team)
🧱 1. Event Creation (HIGH PRIORITY)

Add toggle: Enable Referral

If ON:

Select:

Fixed / Percentage

Input value

Tooltip UI

📊 2. Referral Dashboard

Total Earnings

Pending Earnings (not yet checked-in)

Withdrawable Balance

List:

Event

Buyer (masked)

Status:

pending

credited

🔗 3. Referral Link UI

Copy button

Per event link generation

🎟 4. Event Page Update

Detect referral (cookie)

Attach silently to purchase

💰 5. Wallet Page

Balance

Withdraw button

History list

🚫 6. Edge Cases UI

“Reward pending until event check-in”

Empty states

Failed withdrawal

🔹 BACKEND API (Python)

Keep it REST. Clean. No noise.

🔐 Auth
POST /auth/signup
POST /auth/login
GET  /auth/me
🎟 Events
POST /events
GET  /events/{id}
GET  /events?referral_enabled=true
Payload (Create Event)
{
  "title": "Event",
  "price": 5000,
  "referral_enabled": true,
  "reward_type": "percentage",
  "reward_value": 30
}
🔗 Referral
GET /ref/{refCode}/event/{eventId}
Logic:

Validate ref

Set cookie:

response.set_cookie("ref_code", refCode, max_age=7*24*60*60)

Redirect → /events/{eventId}

🎫 Ticket Purchase Hook

(Internal, after payment confirm)

POST /internal/referral/track
{
  "buyer_id": "...",
  "event_id": "...",
  "ticket_id": "...",
  "ref_code": "..."
}

Status:

pending_checkin

✅ Check-in Hook (CRITICAL)
POST /internal/tickets/checkin
Logic:
if referral_exists:
    if reward_type == "fixed":
        reward_amount = reward_value
    else:
        reward_amount = (ticket_price * reward_value / 100)

    credit_user(referrer_id, reward_amount)

Status → credited

💰 Wallet
GET /wallet
GET /wallet/history
💸 Withdrawal
POST /withdrawals
GET  /withdrawals
Rule:
if balance < 500:
    reject()
🧠 Data Models (Simplified)
referrals
{
  "id": "",
  "referrer_id": "",
  "buyer_id": "",
  "event_id": "",
  "ticket_id": "",
  "amount": 0,
  "status": "pending | credited"
}

