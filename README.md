# Huzaifa Nadeem — Portfolio

A **production-level, full-stack portfolio web application** built with Next.js 14, TypeScript, Tailwind CSS, and Supabase. Features a fully dynamic public portfolio and a secure Admin CMS for complete content management.

---

## Tech Stack

| Layer       | Technology                              |
|-------------|----------------------------------------|
| Frontend    | Next.js 14 (App Router), TypeScript    |
| Styling     | Tailwind CSS, custom design system     |
| Backend     | Supabase (PostgreSQL, Auth, Storage)   |
| ORM / Data  | Supabase JS client (RLS enforced)      |
| Forms       | React Hook Form + Zod validation       |
| Hosting     | Vercel                                 |

---

## Project Structure

```
Portfolio 1.2/
├── app/
│   ├── (public)/           # Public-facing portfolio (route group)
│   │   ├── page.tsx        # Home — Hero, About, Skills, Projects, Education, Contact
│   │   └── layout.tsx      # Navbar + Footer wrapper
│   ├── admin/              # Protected admin CMS
│   │   ├── layout.tsx      # Sidebar + top-bar (auth-guarded)
│   │   ├── page.tsx        # Dashboard with stats
│   │   ├── login/          # Admin login page
│   │   ├── profile/        # Edit profile info
│   │   ├── projects/       # Project CRUD + image upload
│   │   │   └── [id]/       # Project editor (new or edit)
│   │   ├── skills/         # Skill category management
│   │   └── messages/       # Contact form inbox
│   ├── api/
│   │   └── contact/        # POST — save contact form messages
│   ├── sitemap.ts          # Auto-generated sitemap
│   ├── robots.ts           # Robots.txt config
│   ├── layout.tsx          # Root layout (ThemeProvider, Toaster)
│   └── globals.css         # Design system / Tailwind base
├── components/
│   ├── layout/             # Navbar, Footer
│   ├── sections/           # Hero, About, Skills, Projects, Education, Contact
│   ├── admin/              # AdminSidebar
│   ├── ui/                 # ThemeToggle, SkeletonCard, Badge, ErrorBoundary
│   └── providers/          # ThemeProvider
├── lib/
│   ├── supabase/
│   │   ├── client.ts       # Browser client
│   │   ├── server.ts       # Server client (RSC / route handlers)
│   │   └── middleware.ts   # Session refresh + route protection
│   ├── queries.ts          # Centralised data access layer
│   └── utils.ts            # cn(), formatDate(), etc.
├── types/
│   └── database.ts         # Full TypeScript types mirroring DB schema
├── supabase/
│   ├── schema.sql          # Database schema + seed data
│   └── rls-policies.sql    # Row Level Security policies
├── middleware.ts            # Next.js middleware (auth guard)
└── ...config files
```

---

## Quick Start — Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Copy your **Project URL** and **anon key** from Settings → API

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Set up the database

In your Supabase dashboard → **SQL Editor**:

1. Run `supabase/schema.sql` — creates tables and seeds initial data
2. Run `supabase/rls-policies.sql` — applies Row Level Security

### 5. Create a Storage bucket

In Supabase dashboard → **Storage**:

1. Create a new bucket named **`project-images`**
2. Set it to **Public**

### 6. Create the admin user

In Supabase dashboard → **Authentication** → **Users** → **Invite User**:

Enter your email address. You'll receive a link to set a password.
This user is your admin — no extra configuration needed.

### 7. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the portfolio.
Open [http://localhost:3000/admin](http://localhost:3000/admin) for the CMS.

---

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/portfolio.git
git push -u origin main
```

### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
2. Select your repo

### 3. Add environment variables

In Vercel project settings → **Environment Variables**, add:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.vercel.app` |

### 4. Deploy

Click **Deploy**. Vercel auto-deploys on every push to `main`.

---

## Security Architecture

| Layer | Protection |
|-------|-----------|
| **Route guard** | `middleware.ts` redirects unauthenticated requests to `/admin/login` |
| **Server-side guard** | `admin/layout.tsx` verifies session via `supabase.auth.getUser()` |
| **Database (RLS)** | Public tables are read-only; write operations require auth token |
| **Messages** | Only authenticated admin can read/delete messages |
| **Keys** | Only `NEXT_PUBLIC_*` (anon) keys are used in the browser — never service role |
| **Contact form** | Rate-limited to 3 requests/hour per IP |
| **Input validation** | Zod schemas on all form inputs + API routes |

---

## Admin CMS Features

| Feature | Location |
|---------|----------|
| Edit profile (name, bio, title, links, resume) | `/admin/profile` |
| Create / edit / delete projects | `/admin/projects` |
| Publish / unpublish projects | `/admin/projects` (eye icon) |
| Toggle featured projects | `/admin/projects` (star icon) |
| Upload / replace project images | `/admin/projects/[id]` |
| Add / delete skills by category | `/admin/skills` |
| Read / delete contact messages | `/admin/messages` |
| Mark messages read/unread | `/admin/messages` |

---

## Database Schema

```sql
profiles    (id, name, title, bio, email, github, linkedin, resume_url, updated_at)
projects    (id, title, description, tech_stack[], category, image_url, github_url, featured, is_published, created_at)
skills      (id, category, name, sort_order)
messages    (id, name, email, message, is_read, created_at)
```

---

## Scalability Notes

- **ISR** (`revalidate = 60`) on the homepage — fast static delivery with automatic updates
- Move rate-limiting to **Upstash Redis** for multi-region deployments
- Add **Supabase Realtime** subscriptions for live message notifications in the admin
- Extend `profiles` table with a `projects_order` column for drag-and-drop sorting
- Add a `tags` table for many-to-many skill/project relationships
- Implement **Supabase Edge Functions** for complex server-side logic

---

## License

MIT — feel free to use as a template.
