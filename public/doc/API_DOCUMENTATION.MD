# Axile Referral System API Documentation

Base URL: `/api`

---

## Overview

This API supports the referral system for Axile where users (referees) earn rewards when tickets purchased through their referral links are **successfully checked-in**.

There are **two distinct user systems**:
- Referee (referral users)
- Organizer (event creators)

⚠️ Do NOT mix tokens between them.

---

## Authentication

### Referee Auth

#### Signup
POST `/signup/`

```json
{
  "username": "string",
  "firstname": "string",
  "lastname": "string",
  "email": "string",
  "password": "string",
  "phone": "string (optional)"
}
Verify OTP

POST /verify-otp/

{
  "email": "string",
  "otp": "string"
}

Response:

{
  "user": {},
  "referree_id": "string"
}
Login

POST /login/

{
  "email": "string",
  "password": "string"
}

Response:

{
  "access": "jwt_token",
  "refresh": "jwt_token"
}
Google Signup

POST /referee/google-signup/

{
  "token": "google_access_token"
}
Logout

POST /logout/

{
  "refresh": "token"
}
Profile

GET /referee/profile/
PATCH /referee/profile/

Referee Events (Referral Enabled Only)

Requires:

Authorization: Bearer <access_token>
Get All Referral Events

GET /referee/events/

Response:

{
  "events": [
    {
      "event_id": "event:AB-12345",
      "event_slug": "summer-fest",
      "name": "Summer Fest",
      "event_type": "music",
      "pricing_type": "paid",
      "location": "Lagos",
      "date": "2025-06-01T18:00:00Z",
      "image": "https://...",
      "use_referral": true,
      "referral_reward_type": "percentage",
      "referral_reward_amount": null,
      "referral_reward_percentage": 7.5
    }
  ],
  "count": 1
}
Get Single Event

GET /referee/events/<identifier>/

identifier = event_id OR event_slug

Referral Reward Fields
Field	Description
use_referral	Boolean (event has referral enabled)
referral_reward_type	"flat" or "percentage"
referral_reward_amount	Used if type = flat
referral_reward_percentage	0–100 if type = percentage
Organizer Event APIs (Referral Config)
Create Event

POST /event/

Update Event

PATCH /events/<event_id>/update/

Referral Fields
{
  "use_referral": true,
  "referral_reward_type": "percentage",
  "referral_reward_percentage": 30
}
Rules

If use_referral = true:

referral_reward_type is required

If flat → referral_reward_amount required

If percentage → referral_reward_percentage required (0–100)

If use_referral = false:

All referral fields are cleared

Get Organizer Events

GET /organizer/events/

Includes referral config.

Config (Dropdown Support)

GET /config/

Response:

{
  "referral_reward_types": [
    { "value": "flat", "label": "Flat amount" },
    { "value": "percentage", "label": "Percentage" }
  ]
}
Public vs Referee Access
Endpoint	Referral Fields
GET /events/<id>/details/	❌ Hidden
GET /event/	❌ Hidden
GET /referee/events/	✅ Visible
Referral Flow (Frontend Responsibility)

User clicks referral link:

referral.axile.ng/ref/{code}/event/{eventId}

Frontend:

Store ref_code in cookie/localStorage

On ticket purchase:

Attach ref_code

Backend:

Tracks referral

Rewards AFTER ticket check-in

Reward Logic (Important)

Rewards are NOT given on signup

Rewards are NOT given on payment

Rewards are ONLY given after:

Ticket is checked-in

Event is valid

Notes for Frontend Devs

Always use referee endpoints for referral UI

Do NOT expose referral reward fields on public pages

Cache referral code for at least 7 days

Handle states:

pending (not checked-in)

credited (earned)
