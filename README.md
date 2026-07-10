# ⏱️ AnimeCount

AnimeCount is a minimal, elegant watch-time calculator and database tracking system designed to calculate and visualize the exact time (in days, hours, and minutes) spent watching anime.

---

## 📸 Screenshots

| Landing Page (Logged Out) | Dashboard & Tracking (Logged In) |
| --- | --- |
| ![Landing Page Placeholder](https://placehold.co/600x400/18181b/ffffff?text=Landing+Page+Dashboard) | ![Dashboard Placeholder](https://placehold.co/600x400/18181b/ffffff?text=Dashboard+and+Quick+Increments) |
| *Clean call-to-action inviting users to begin tracking.* | *Interface for quick tracking, pinning, and updating watch list entries.* |

| Detailed Profile & Stats | Mobile Responsive View |
| --- | --- |
| ![Profile Stats Placeholder](https://placehold.co/600x400/18181b/ffffff?text=Profile+Analytics+and+History) | ![Mobile View Placeholder](https://placehold.co/300x500/18181b/ffffff?text=Mobile+View) |
| *Lifetime statistics, average ratings, and data portability controls.* | *Responsive layout scaled for viewing on mobile devices.* |

---

## ✨ Features

- **Precision Watch Time Metrics:** Dynamically computes exact watch time metrics (scalable from minutes and hours to days, weeks, months, and years) based on completed episodes and individual show durations rather than just basic counter increments.
- **Dual API Sync & Local Cache:** Queries global anime datasets from AniList (via GraphQL) and Jikan (via REST API fallback), automatically normalizing and caching titles, studios, genres, and release years inside the local database.
- **Interactive Dashboard Tracker:** Rapidly update anime watch history with +1 quick episode increments, custom rating grades (1–10 scale), text notes, pin-to-top controls, and watch statuses (`WATCHING`, `COMPLETED`, `PLAN_TO_WATCH`, `DROPPED`, `REWATCHING`).
- **Undo / Recovery Toast System:** Built-in deletion rollback via a state-managed toast notification to restore accidentally deleted watch list entries instantly.
- **Advanced Profile Analytics:** Displays advanced user analytics including watching streaks, average scores, favorite genres, favorite animation studios, release-year distribution, longest shows, and shows with the highest episode counts.
- **Full Data Portability:** Export your entire watchlist history into standardized JSON or CSV formats, and import backup files to migrate records without losing user configurations.
- **Secure Authentication Suite:** Credentials registration, Google OAuth sign-in, email verification, and password resets using a modular Better Auth integration supported by Nodemailer.
- **Modern User Experience:** Beautiful fluid interface built with a native dark mode, high-contrast layouts, custom badges, and responsive UI transitions powered by Framer Motion.

---

## 🛠 Tech Stack

- **Core & Routing:** [Next.js 16.2.9](https://nextjs.org/) (App Router), [React 19.2.4](https://react.dev/)
- **Database & ORM:** PostgreSQL database with [Prisma ORM 6.19.3](https://www.prisma.io/)
- **Authentication:** [Better Auth 1.6.22](https://www.better-auth.com/) (Credentials & Google OAuth Provider)
- **Styling:** [Tailwind CSS 4.0](https://tailwindcss.com/) with `@tailwindcss/postcss`
- **Animations:** [Framer Motion 12.42.0](https://www.framer.com/motion/)
- **Notification & Celebration:** [Canvas Confetti](https://github.com/catdad/canvas-confetti)
- **Utilities:** Papaparse (CSV generation/parsing), Lucide React (vector icons), Zod (schema validations)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed on your local environment
- PostgreSQL database instance active and running

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/animecount.git
   cd animecount
   ```

2. **Install package dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the project root directory. Do not commit this file to version control. Define the variables as follows:
   ```env
   # Database connection string
   DATABASE_URL="postgresql://YOUR_DATABASE_USER:YOUR_DATABASE_PASSWORD@YOUR_DATABASE_HOST:5432/YOUR_DATABASE_NAME?schema=public"

   # Better Auth Settings
   BETTER_AUTH_SECRET="YOUR_BETTER_AUTH_SECRET"
   BETTER_AUTH_URL="YOUR_APP_URL" # e.g. http://localhost:3000

   # SMTP Setup for system emails (Verification & Password Resets)
   SMTP_HOST="YOUR_SMTP_HOST"
   SMTP_PORT=587
   SMTP_USER="YOUR_SMTP_USERNAME"
   SMTP_PASS="YOUR_SMTP_PASSWORD"
   EMAIL_FROM="YOUR_EMAIL_FROM_ADDRESS"

   # Google OAuth Provider Credentials
   GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
   GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"
   NEXTAUTH_SECRET="YOUR_NEXTAUTH_SECRET"
   ```

4. **Initialize Database Schema:**
   Apply database migrations and compile the Prisma client:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📁 Project Structure

```
.
├── prisma/                  # Database migration schemas
└── src/
    ├── actions/             # Next.js Server Actions (CRUD, Import/Export, Anime searches)
    ├── app/                 # Page routes, API router endpoints, layout shells
    ├── components/          # Core reusable interface components (layout, alerts, ui/badge/button)
    ├── emails/              # Verification and reset email templates
    ├── features/            # Feature modules (QuickEditModal, SearchModal)
    ├── lib/                 # Core configs (Prisma connection, Email clients, Auth wrappers)
    └── services/            # Core logic handlers (APIs search queries, User statistics engines)
```

---

## 🗺 Roadmap / Future Improvements

- **Interactive Statistical Visualizations:** Integrate interactive graphs (using Recharts) to plot watch time spikes and monthly trends.
- **Direct Two-Way List Sync:** Add native OAuth sync features to automatically post watchlist updates back to AniList and MyAnimeList accounts.
- **Advanced Query Filters:** Introduce filter configurations to refine search results and list tables by specific years, seasons, genres, and ratings.
- **Milestone Achievements:** Create badge unlock notifications (e.g. "Watched 100 Episodes", "5-Day Streak") with confetti celebrations.

---

## 📄 License

This project is licensed under the MIT License.
