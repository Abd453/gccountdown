<div align="center">

# 🎓 GC Countdown

**A modern, real-time graduation countdown and event planner — built for the graduating class of 2026.**

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-BB4FFF?logo=framer)](https://www.framer.com/motion)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

[Live Demo](https://gccountdown.vercel.app) · [Report a Bug](https://github.com/Abd453/gccountdown/issues) · [Request a Feature](https://github.com/Abd453/gccountdown/issues)

</div>

---

## 📖 Overview

**GC Countdown** is a personal graduation countdown and milestone tracking app built for students approaching their graduation day. It provides a live, second-by-second countdown to **June 20, 2026**, tracks all key academic milestones, lets you manage your own custom events, and sends browser notifications when important dates are approaching.

The interface is built with a dark, premium glassmorphism aesthetic — featuring smooth animations, urgency-based color cues, real-time progress tracking, and a fully guided onboarding tour.

---

## ✨ Features

### 🕐 Live Countdown
- Real-time **days / hours / minutes / seconds** countdown to graduation day
- Color urgency system — green → yellow → red as the date approaches
- Motivational message that rotates daily

### 📅 Milestone Events
Predefined system events covering the full academic endgame:

| Event | Date(s) |
|---|---|
| Exit Exam Model | Apr 17, 2026 |
| Final Exams | May 11 – May 22, 2026 |
| Thesis Defense | May 18 – May 22, 2026 |
| Exit Exam | Jun 10 – Jun 17, 2026 |
| Graduation Day 🎓 | Jun 20, 2026 |

### 📝 Custom Events
- Add your own personal events with **title, start date, end date, start time, and end time**
- **Edit** any custom event at any time via the kebab menu (⋮) on the card
- **Delete** events one by one or enter **selection mode** to bulk-delete multiple custom events at once
- **Responsive UI:** Custom events seamlessly adapt to small screens, showing up to three cards initially with "Show more / Show less" expansion buttons
- All custom events are **persisted to `localStorage`** — they survive page refreshes

### 📊 Journey Progress Bar
- Visual progress bar from the first milestone to graduation day
- Shows how far along the journey you are in real time

### ⏱️ Today's Panel
- Dynamically shows countdowns for events **starting or ending today**
- Displays hours/minutes/seconds remaining for precise scheduling

### 🔔 Browser Notifications
- Request native browser notification permission in one click
- Automatic alerts triggered at:
  - **1 week before** an event starts
  - **1 day before** an event starts
  - **The day an event starts**
  - **While an event is ongoing** (on app open)
- Each notification fires only **once per condition per event** (deduped via `localStorage`)

### 🗺️ Onboarding Tour
- A step-by-step interactive tour for first-time visitors
- Highlights: Countdown, Events, Notifications, Custom Events sections
- Tour state is remembered across sessions

---

## 🗂️ Project Structure

```
gccountdown/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout, fonts, metadata
│   │   ├── page.tsx                # Main application page & state
│   │   ├── globals.css             # Global base styles
│   │   ├── exit-exam-model/        # Detail page: Exit Exam Model
│   │   └── milestone-info/         # Detail pages: system milestones
│   │
│   ├── components/
│   │   ├── EventCard.tsx           # Event card with kebab menu (edit/delete)
│   │   ├── EditEventModal.tsx      # Full edit modal for custom events
│   │   ├── ConfirmDeleteModal.tsx  # Confirmation dialog for deletion
│   │   ├── CustomEventForm.tsx     # Form to add new custom events
│   │   ├── CountdownCard.tsx       # Live days/hours/minutes/seconds display
│   │   ├── ProgressCard.tsx        # Journey progress bar
│   │   ├── TodayPanel.tsx          # Today's event countdowns
│   │   ├── ToastMessage.tsx        # Animated toast notifications
│   │   └── OnboardingTour.tsx      # Interactive first-visit tour
│   │
│   ├── hooks/
│   │   └── useCountdown.ts         # Tick-every-second countdown hook
│   │
│   └── lib/
│       ├── events.ts               # All event logic, helpers & utilities
│       ├── storage.ts              # localStorage load/save with validation
│       └── types.ts                # Shared TypeScript types
│
├── public/                         # Static assets
├── next.config.ts                  # Next.js configuration
├── tailwind.config / postcss       # Styling configuration
└── tsconfig.json                   # TypeScript configuration
```

---

## 🧠 Architecture & Design Decisions

### State Management
All state lives in `page.tsx` and is passed down via props — no external state library is needed given the scope. The key pieces of state are:

| State | Purpose |
|---|---|
| `customEvents` | User-created events, synced to `localStorage` on every change |
| `eventPendingDelete` | The event queued for deletion (opens confirm modal) |
| `eventPendingEdit` | The event queued for editing (opens edit modal) |
| `toastMessage` | Current toast text, auto-cleared after 2.2 seconds |
| `notificationPermission` | Browser notification permission status |

### Custom Event Persistence
Custom events are stored as JSON in `localStorage` under the key `graduation-custom-events`. On load, data is validated field-by-field to prevent corrupt data from crashing the app (`storage.ts`).

### Notification Deduplication
Each notification is keyed by `event-notification-{id}-{condition}`. Once fired, the key is written to `localStorage` so the same notification never re-fires even if the user refreshes.

### Urgency Color System
The `getUrgencyTone()` helper in `events.ts` maps days remaining to a color tone:

```
≥ 30 days  →  green   (calm)
10–29 days →  yellow  (alert)
< 10 days  →  red     (urgent)
```

### Date Handling
All dates are parsed with `parseLocalDate()` which uses the `Date` constructor with explicit year/month/day to avoid UTC offset issues that arise from `new Date("YYYY-MM-DD")`.

---

## 🛠️ Tech Stack

| Technology | Version | Role |
|---|---|---|
| [Next.js](https://nextjs.org) | 16.2 | Framework (App Router) |
| [React](https://react.dev) | 19 | UI library |
| [TypeScript](https://typescriptlang.org) | 5 | Type safety |
| [Tailwind CSS](https://tailwindcss.com) | 4 | Utility-first styling |
| [Framer Motion](https://www.framer.com/motion) | 12 | Animations & transitions |
| [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) | — | Primary typeface |
| [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) | — | Monospace / code elements |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.17 or newer
- **npm** (or yarn / pnpm / bun)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Abd453/gccountdown.git
cd gccountdown

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server with hot reload |
| `npm run build` | Build the production bundle |
| `npm run start` | Run the production build locally |
| `npm run lint` | Run ESLint across the project |

---

## 🌐 Deployment

The easiest way to deploy GC Countdown is on **[Vercel](https://vercel.com)** — the platform built by the creators of Next.js.

```bash
# Install the Vercel CLI globally
npm install -g vercel

# Deploy from the project root
vercel
```

Or connect your GitHub repository directly at [vercel.com/new](https://vercel.com/new) and Vercel will auto-detect the Next.js project and deploy on every push to `main`.

---



## 🤝 Contributing

Contributions are welcome! To get started:

1. **Fork** the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a **Pull Request** against `main`

Please keep components focused, reuse existing styles, and follow the TypeScript patterns already in place.

---

## 📄 License

This project is open source and available under the [MIT License](./LICENSE).

---

<div align="center">

Built with ❤️ by [Abdallah Abdurazak](https://github.com/Abd453)

⭐ **Star this repo** if it helped you stay motivated through graduation!

</div>
